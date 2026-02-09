 // Cr-éation du patient
        const newPatient = new Patient({
            identifiant,
            password: hashedPassword,
            name,
            numero,
            dateNaissance,
            adresse,
            sexe,
            numerodesecurity,
            maladiechroniques,
            groupeSanguin,
            typeCancer,
            allergies,
            stadeCancer,
            dateDiagnostic,
            medecinsTraitants: [req.user._id]
        });
        
        await newPatient.save();

        res.json({ 
            success: true, 
            message: "Patient créé avec succès",
            patient: newPatient 
        });