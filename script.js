function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelector('.start-screen').style.display = 'none';
    document.getElementById(screenId).classList.add('active');
  }
  
  function backToStart() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelector('.start-screen').style.display = 'block';
  }
  
  function saveOrganization() {
    const orgName = document.getElementById('org-name').value;
    const orgLocation = document.getElementById('org-location').value;
    const orgDate = document.getElementById('org-date').value;
  
    const organizationData = JSON.parse(localStorage.getItem('organizationData')) || {};
    organizationData[orgName] = { name: orgName, location: orgLocation, date: orgDate };
    localStorage.setItem('organizationData', JSON.stringify(organizationData));
  
    alert("Organization saved!");
  }
  
  function loadOrganizations() {
    const organizationData = JSON.parse(localStorage.getItem('organizationData')) || {};
    const orgSelect = document.getElementById('org-select');
    orgSelect.innerHTML = '';
  
    for (const key in organizationData) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      orgSelect.appendChild(option);
    }
  }
  
  function registerPatient() {
    const organization = document.getElementById('org-select').value;
    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const weight = document.getElementById('patient-weight').value;
    const bloodGroup = document.getElementById('patient-blood-group').value;
    const gender = document.getElementById('patient-gender').value;
  
    // Get the last used token from localStorage or start from 1
    let lastToken = parseInt(localStorage.getItem('lastToken')) || 0;
    
    // Increment the token by 1
    const token = `T${lastToken + 1}`;

    // Store the new token as the last used token in localStorage
    localStorage.setItem('lastToken', lastToken + 1);

    // Retrieve the existing patients object or create a new one
    const patients = JSON.parse(localStorage.getItem('patients')) || {};

    // Add the new patient with the incremented token
    patients[token] = { organization, name, age, weight, bloodGroup, gender };

    // Save the updated patients object to localStorage
    localStorage.setItem('patients', JSON.stringify(patients));

  
    alert(`Patient registered with token: ${token}`);
  }
  
  function fetchPatientDetails() {
    const token = document.getElementById('patient-token').value;
    const patients = JSON.parse(localStorage.getItem('patients')) || {};
    const patient = patients[token];
  
    if (patient) {
      document.getElementById('patient-details').innerHTML = `
        <p>Organization: ${patient.organization}</p>
        <p>Name: ${patient.name}</p>
        <p>Age: ${patient.age}</p>
        <p>Weight: ${patient.weight}</p>
        <p>Blood Group: ${patient.bloodGroup}</p>
        <p>Gender: ${patient.gender}</p>
      `;
    } else {
      alert("Patient not found!");
    }
  }
  
  function saveDiagnosis() {
    const token = document.getElementById('patient-token').value;
    const breastCancer = document.getElementById('breast-cancer').value;
    const dental = document.getElementById('dental').value;
    const eyeCheck = document.getElementById('eye-check').value;
  
    const patients = JSON.parse(localStorage.getItem('patients')) || {};
    if (patients[token]) {
      patients[token].diagnosis = { breastCancer, dental, eyeCheck };
      localStorage.setItem('patients', JSON.stringify(patients));
      alert("Diagnosis saved!");
    } else {
      alert("Patient not found!");
    }
  }
  
  function downloadData() {
    const organizationData = JSON.parse(localStorage.getItem('organizationData')) || {};
    const patients = JSON.parse(localStorage.getItem('patients')) || {};
    const data = { organizationData, patients };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient_data.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function downloadDataCSV() {
    const patients = JSON.parse(localStorage.getItem('patients')) || {};
    let csv = "Token,Organization,Name,Age,Weight,Blood Group,Gender,Breast Cancer,Dental,Eye Check\n";
  
    for (const token in patients) {
      const patient = patients[token];
      csv += `${token},${patient.organization},${patient.name},${patient.age},${patient.weight},${patient.bloodGroup},${patient.gender},${patient.diagnosis?.breastCancer || ''},${patient.diagnosis?.dental || ''},${patient.diagnosis?.eyeCheck || ''}\n`;
    }
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Load organizations when patient registration screen is opened
  document.getElementById('patient-registration').addEventListener('click', loadOrganizations);
  