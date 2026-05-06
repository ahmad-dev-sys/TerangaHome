(function() {
    const form = document.getElementById('terangaForm');
    const statusDiv = document.getElementById('formStatus');

    // Personnalisation de l'envoi via fetch pour avoir un feedback moderne
    // tout en respectant l'endpoint Formspree (maqvbblw)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Petite validation simple des champs requis html5 déjà gérée mais on force les radios/genre
      const genreChecked = document.querySelector('input[name="Genre"]:checked');
      const ageValue = form.querySelector('select[name="Age"]').value;
      const paysValue = form.querySelector('input[name="Pays_origine"]').value.trim();
      const villeValue = form.querySelector('select[name="Ville_etude"]').value;

      if (!genreChecked || !ageValue || !paysValue || !villeValue) {
        statusDiv.className = 'form-status error';
        statusDiv.innerText = '⚠️ Merci de remplir tous les champs obligatoires : genre, âge, pays d\'origine et ville d\'étude.';
        statusDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Récupération des difficultés sous forme lisible
      const difficulties = Array.from(document.querySelectorAll('#difficultiesGroup input[type="checkbox"]:checked'))
        .map(cb => cb.value);
      const difficulteTexte = difficulties.length ? difficulties.join(' ; ') : 'Aucune sélectionnée';

      // Ajouter une variable cachée pour la lisibilité dans l'email (optionnel via FormData)
      const formData = new FormData(form);
      // Ajouter une entrée synthétique "Difficultes_synthese" pour avoir la liste dans l'email
      formData.append('Difficultes_liste', difficulteTexte);

      // Option : récupérer les autres valeurs radio non standards
      const payContact = document.querySelector('input[name="Paiement_contact"]:checked')?.value || 'Non précisé';
      const meubleInterest = document.querySelector('input[name="Interet_meubles"]:checked')?.value || 'Non précisé';
      formData.append('Accepte_paiement_contact', payContact);
      formData.append('Interet_meubles_plateforme', meubleInterest);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          statusDiv.className = 'form-status success';
          statusDiv.innerHTML = '✅ Merci infiniment ! Votre réponse a été envoyée à TerangaHome. Nous allons analyser vos besoins pour créer la meilleure solution de logement étudiant au Sénégal. <br> 🔜 On vous tient informé !';
          statusDiv.style.display = 'block';
          form.reset();
          // Remise à zéro des groupes radio/checkbox supplémentaires géré par reset
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const errorText = await response.text();
          console.warn(errorText);
          throw new Error('Erreur serveur Formspree');
        }
      } catch (err) {
        console.error(err);
        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = '❌ Problème de connexion. Vérifiez votre internet ou réessayez dans quelques instants. Si le problème persiste, contactez-nous via WhatsApp (mentionné dans l’enquête).';
        statusDiv.style.display = 'block';
      }
    });
  })();