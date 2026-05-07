import { User } from "../model/User";
import type { CreateUserInput } from "../model/validate.user";

export const createUser = async (data: CreateUserInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if(existingUser) {
    throw new Error("User already exists");
  }
  return await User.create(data);
};

export const getUsers = async () => {
  return await User.find();
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email }).select("+password");
};

export const updateUser = async (id: string, data: Partial<CreateUserInput>) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};