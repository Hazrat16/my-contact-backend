const expressAsyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route Get /v1/api/contacts
//@access public

const getContacts = expressAsyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Get  contact by id
//@route Get /v1/api/contact/:id
//@access public

const getContactById = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("404 not found");
  }
  res.status(200).json(contact);
});

//@desc Post  contact
//@route Post /v1/api/contacts
//@access private

const createContacts = expressAsyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  console.log("id",req)
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(contact);
});

//@desc Put  contact
//@route Put /v1/api/contacts/:id
//@access private

const updateContacts = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("404 not found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to update")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Delete  contact
//@route Delete /v1/api/contacts/:id
//@access private

const deleteContacts = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("404 not found");
  }
  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to delete")
  }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContactById,
  createContacts,
  updateContacts,
  deleteContacts,
};
