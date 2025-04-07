document.getElementById("degreeSelect").addEventListener("change", async (e) => {
    const value = e.target.value;
    if (!value) return;
  
    const data = await fetch(`./data/${value}.json`).then(res => res.json());
    const outputDiv = document.getElementById("degreeOutput");
    outputDiv.innerHTML = "";
  
    const title = data.degree || data.concentration || data.concentration?.title || "Degree Plan";
    outputDiv.innerHTML += `<h2>${title}</h2>`;
  
    // Normalize all potential schema structures
    const sections = [];
  
    // Support for common section containers
    if (data.sections) sections.push(...data.sections);
    if (data.requirements) {
      for (const key in data.requirements) {
        if (Array.isArray(data.requirements[key]) || data.requirements[key]?.courses || data.requirements[key]?.options) {
          sections.push({ label: key, ...data.requirements[key] });
        }
      }
    }
    if (data.coreCourses) sections.push({ label: "Core Courses", courses: data.coreCourses });
    if (data.mathStatsCourses || data.math_and_stats || data.mathStats)
      sections.push({ label: "Math and Stats", courses: data.mathStatsCourses || data.math_and_stats || data.mathStats });
  
    if (data.capstone || data.capstoneCourses || data.capstoneOptions)
      sections.push({ label: "Capstone", courses: data.capstoneCourses || data.capstoneOptions || data.capstone });
  
    if (data.concentrationRequirements) {
      if (data.concentrationRequirements.requiredCourses)
        sections.push({ label: "Concentration Required", courses: data.concentrationRequirements.requiredCourses });
      if (data.concentrationRequirements.technicalElectives)
        sections.push({ label: "Concentration Technical Electives", note: data.concentrationRequirements.technicalElectives.options || data.concentrationRequirements.technicalElectives });
    }
  
    if (data.concentration?.required)
      sections.push({ label: "Concentration Required", courses: data.concentration.required });
    if (data.concentration?.electives)
      sections.push({ label: "Concentration Electives", note: data.concentration.electives.options });
  
    if (data.concentration_required)
      sections.push({ label: "Concentration Required", courses: data.concentration_required });
    if (data.concentration_electives)
      data.concentration_electives.forEach(e =>
        sections.push({ label: `Electives: ${e.category}`, courses: e.options })
      );
  
    // Render sections
    for (const section of sections) {
      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add("section");
      sectionDiv.innerHTML = `<h3>${section.label || section.name}</h3>`;
  
      if (section.note) {
        sectionDiv.innerHTML += `<p><i>${typeof section.note === 'string' ? section.note : JSON.stringify(section.note)}</i></p>`;
      }
  
      if (section.courses || section.options) {
        const courseList = document.createElement("ul");
        courseList.style.listStyleType = "none";
        const items = section.courses || section.options;
        items.forEach(c => {
          let code = c.code || c.course || c;
          let title = c.title || "";
          let credits = c.credits ? ` (${c.credits} cr)` : "";
          const li = document.createElement("li");
          li.innerText = `${code} ${title}${credits}`;
          courseList.appendChild(li);
        });
        sectionDiv.appendChild(courseList);
      }
  
      outputDiv.appendChild(sectionDiv);
    }
  });
  