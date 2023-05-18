//importation package
const express = require('express');
const Model = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const check = require("../middleware/middleware");
const Abonnement = require('../models/abonnement');
const abonnement = require('../models/abonnement');


const router = express.Router()

module.exports = router;

// La connexion par formulaire
router.post("/login", async (req, res, next) => { // Async pour dire que la connexion ne dépend d'aucun processus 
    // On Récupère l'email et le mot de passe contenus dans la requete
    let { prenom, nom , email, password } = req.body;

    let existingUser;

    // Retrouve l'email saisi dans la base de données et stocke ça dans existingUser
    existingUser = await Model.findOne({ email: email });
    if (!existingUser) { // si l'email ne s'y trouve pas donne le message
        return res.status(404).send("email doesn't exist...!");
    }

    // On sort de if donc ça suppose que l'email existe
    //On vérifie maintenant si le mot de passe est correct ou pas
    // Comparaison entre le mot de passe saisi et celui se trouvant dans la base de données
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) { // Le mot de passe n'est pas le bon
        return res.status(401).send("password is invalid");
    }

    // Maintenant que tout est bon (email et mot de passe correctes), on genere un token
    let token;
    try {  // Essaye de faire ceci ...
        //Creating jwt token
        token = jwt.sign(
            { userId: existingUser.id,prenom: existingUser.prenom,nom: existingUser.nom,email: existingUser.email }, // id et email de la personne connectée
            process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
            { expiresIn: "1h" } // delai d'expiration du token
        );
    } catch (err) {  // Informe-moi avec un message s'il y'a problème
        console.log(err);
        const error = new Error("Erreur! Quelque chose s'est mal passée!");
        return next(error);
    }
    // Si la tentative de connexion s'est bien déroullée, on envoi une réponse
    // avec les informations (id, email, nom, prenom et un token)
    return res
        .status(200)
        .json({
            success: true,
            data: {
                userId: existingUser.id,
                prenom: existingUser.prenom,
                nom: existingUser.nom,
                email: existingUser.email,
                password: existingUser.password,
                token: token,
            },
        });
});

//Methode poste pour envoyer dans la base de données
router.post('/post', async (req, res) => {
    //Recupération des donneés en basant basant sur le model 
    const { prenom,nom,email, password } = req.body;
    const users = [];
    const newUser = Model({ 
        prenom,
        nom,
        email,
        password,

       
    });
    //
    try {
        const oldUser = await Model.findOne({ email });
        
        if (oldUser) {
            return res.status(401).send("Email Already Exist. Please Login");
        }
        const hash = await bcrypt.hash(newUser.password, 10);
        newUser.password = hash;
        users.push(newUser);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
});

//Methode de recuperation de tous les utilisateurs
router.get('/getAll',check, async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Methode de recuperation d'un seul utilisateur
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        return res.json(data)
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

//Methode pour la modification d'un utilisateur
router.patch('/update/:id', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
console.log(req.params.id);
    try {

        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(id, updatedData, options)

        // Comparer l'ancien mot de passe avec le mot de passe haché dans la base de données
        const passwordMatch = await bcrypt.compare(oldPassword, result.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe de l'utilisateur dans la base de données
        result.password = hashedPassword;
        await result.save();

        return res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

//Methode pour supprimer un utilisateur
router.delete('/delete/:id', check, async (req, res) => {
    try {

        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Le Document avec le nom ${data.email} ${data.password} a été supprimé..`)

        return res.send(data)
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});
//abonnements
router.post('/abonnement', async (req, res) => {
    //Recupération des donneés en basant basant sur le model 
    const { prenom,nom,codeacces, Type,prix,description,montant,solde } = req.body;
     
    const abonnement = Abonnement({

        prenom,
        nom,
        codeacces,
        Type,
        prix,
        description,
        montant,
        solde

       
    });
    //
    try {
        
        const save = await abonnement.save()

        if (save) {
            return res.status(200).json({ message: abonnement });
        } else{
         return res.status(500).json({ message: 'error lors de la sauvegarde'});
        }
        
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
});

//Methode de recuperation de tous les utilisateurs
router.get('/abonnement/getAll', async (req, res) => {
    try {
        const data = await abonnement.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});
//Methode de recuperation d'un seul utilisateur
router.get('/abonnement/getOne/:id', async (req, res) => {
    try {
        const data = await abonnement.findById(req.params.id);
        return res.json(data)
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});
//Methode pour supprimer un utilisateur
router.delete('/abonnement/delete/:id', check, async (req, res) => {
    try {

        const id = req.params.id;
        const data = await abonnement.findByIdAndDelete(id)
        /* res.send(`Le Document  a été supprimé..`) */

        return res.json({ message: 'objet supprimé.',data: data});
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

//Methode pour modifer un utilisateur
router.patch('/abonnement/modif/:id', check, async (req, res ,next) => {
    try {

        const id = req.params.id;
        const data = await abonnement.findByIdAndUpdate(id)
        /* res.send(`Le Document avec le nom a été modifé..`) */

        return res.json({ message: 'objet modifié.',data: data});
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});


