const { Router } = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/User.js');
const exercise = require('../models/Exercise.js');
const jwt = require('jsonwebtoken');
const validation = require('../validations/validations.js')
const nodemailer = require('nodemailer')


require('dotenv').config();

const {SECRET} = process.env
const {NODEMAILER} = process.env

const router = Router();

router.post('/register', async (req, res) => {

  if(!validation.register(req.body))res.status(500).send('Invalid parameters');

  try {
    const {name, email ,password} = req.body;
    
    const oldUser = await user.findOne({email : email});
    if(oldUser) return res.status(409).send('User already exists');

    const hashPassword = await bcrypt.hash(password, 10);

    const User = await user.create({name,email,password : hashPassword});
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fitfocus43@gmail.com',
        pass: NODEMAILER,
      },
    
    });

    let mailDetails = {
      from: 'fitfocus43@gmail.com',
      to: email,
      subject: 'Confirmación de registro',
      html:"<b> Su usuario fue creado con éxito </b>",
    };

    transporter.sendMail(mailDetails, (error, info) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        console.log('Email enviado');
        res.status(200).json(req.body);
      }
    });

    res.status(201).send(User);
  } catch (error) {
    res.status(500).send(error.message);
  }

});

router.post('/login', async (req, res) => { // Validando las credenciales y devuelve el token.
  
  if(!validation.register(req.body))res.status(500).send('Invalid parameters');

  try {
    const {email , password} = req.body
    
    const User = await user.findOne({email : email})
  
    if(!User) return res.status(404).send('User not found');
    if(User.status === 'desactivated') return res.status(401).send('User desactivated');

    const isValid = await bcrypt.compare(password, User.password);
    if(isValid) {
      const token = jwt.sign({email: email, name : User.name, id : User._id}, "" + SECRET, { expiresIn : '12h'});
      return res.status(200).json(token)
    }else {
      return res.status(401).send('Password not valid')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
});

router.get('/exercises', async (req, res) =>{ // Devuelve unos ejercicios para mostrar
  const Exercises = await exercise.find();
  res.status(200).send(Exercises)
});

router.put('/account', async (req, res) =>{
  try {
    const {email, password} = req.body
    const User = await user.findOne({email : email});
    if(!User) return res.status(404).send('User not found');
  
    const Checked = await bcrypt.compare(password, User.password);
    if(Checked) {
      if(User.status === 'activated') return res.status(400).send('User already activated');
       User.status = 'activated'
       await User.save()
       res.status(200).send('Account activated')
    }else {
     res.status(403).send('Password not valid')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
