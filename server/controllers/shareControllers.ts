import { Request, Response } from "express";
import Share from "../models/Share";
import RouteModel from "../models/Route";
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';
import mongoose from "mongoose";

// User requests to share their journey
// - saves a new share to the database
// - responds with the share id
export const createShare = async (req: Request, res: Response): Promise<void> => {
  try {
    const { route } = req.body;
    if (!route) {
      res.status(400).json({error: "Please provide a route to share"});
      return;
    }
    const user = req.user;
    if (!user) { // TODO: this should be prohibited by the auth middleware
      res.status(401).json({error: "Unauthorized"})
      return;
    }
    const password = uuid();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newRoute = await RouteModel.create(route)
    const newShare = await Share.create({ _id: new mongoose.Types.ObjectId(), owner: user, route: newRoute._id, password: hashedPassword});
    console.log(`http://localhost:5173/observe/${newShare._id}?password=${password}`)
    res.status(200).json({id: newShare._id, password}); // TODO: this needs to be checked to conform to frontend expectations
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}

// Reveiver requests access to a shared journey
// - checks if share with given id exists
// - retrieves stored data for share from the database
// - checks if password is correct
// - responds with data for the requested share
export const accessShare = async (req: Request, res: Response): Promise<void> => {
  try {
    const share = req.share;
    if (!share) {
      res.status(401).json({error: "Unauthorized"})
      return;
    }
    res.status(200).json({id: share._id, route: share.route, owner: share.owner}); // TODO: Right now this only returns id of owner not the whole object
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}