import { Request, Response } from "express";
import { Share } from "../models/Share";
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';

// User requests to share their journey
// - saves a new share to the database
// - responds with the share id
export const createShare = async (req: Request, res: Response) => {
  const { route } = req.body;
  const user = req.user;
  const password = uuid();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // TODO: validate that route conforms to database expectations
  const newShare = await Share.create({user, route, password: hashedPassword});
  res.status(200).json({id: newShare._id, password}); // TODO: this needs to be checked to conform to frontend expectations
}

// Reveiver requests access to a shared journey
// - checks if share with given id exists
// - retrieves stored data for share from the database
// - checks if password is correct
// - responds with data for the requested share
export const accessShare = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!id || !password) {
    return res.status(400).json({error: "Please provide both id and password"})
  }
  if (typeof id !== "string" || typeof password !== "string") {
    return res.status(400).json({error: "All values must be valid strings"})
  }
  const sanitizedId = id.replace(/[$/(){}]/g, "");
  const sanitizedPassword = password.replace(/[$/(){}]/g, "");
  const share = await Share.findOne({_id: id});
  if (!share) {
    return res.status(401).json({error: "Can't access share"});
  }
  const matchingPasswords = await bcrypt.compare(sanitizedPassword, share.password);
  if (!matchingPasswords) {
    return res.status(401).json({error: "Can't access share"});
  }
  res.status(200).json(share); // TODO: Strip of sensitive information
}