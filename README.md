# Team Solaris Capstone - Interactive Graduation Planner

## Overview

The **SolarisCapstone Interactive Graduation Planner** is a tool designed to help **UNC Charlotte computer science students** plan their graduation timeline efficiently. Current academic planning tools, such as **DegreeWorks** and **Schedule Wizard**, lack an intuitive interface and fail to provide a seamless way for students to map out their entire degree path. Our project aims to bridge this gap by offering an interactive solution that allows students to:

- Plan their semester-wise course load.
- Ensure prerequisite requirements are met.
- Optimize their graduation timeline based on credit load and summer courses.
- Provide advisors with better visibility into students’ academic plans for more effective guidance.

This application will **eliminate the need for manual spreadsheets** and simplify academic planning, making it easier for students to stay on track toward graduation.

---

## Project Scope

The primary goal of this project is to develop an interactive graduation planner that allows students to **map out their remaining coursework** with a clear, structured approach. The tool will include the following key components:

- **Course Database:** A structured database containing **computer science course requirements** for UNC Charlotte.
- **User Interface:** A student-friendly UI that enables input of completed and planned courses.
- **Prerequisite Verification:** A system that **prevents scheduling conflicts** by ensuring prerequisite rules are followed.
- **Advisor Portal:** A dedicated portal that allows academic advisors to **review student plans** and provide feedback.

By implementing these features, we aim to **streamline course planning, prevent scheduling mistakes, and help students graduate on time** while reducing advisor workload.

---

## Assumptions

To ensure the functionality and accuracy of the planner, the following assumptions will be made:

- Students will have an accurate understanding of **which courses they have completed** based on their transcript.
- Students using the planner will have already fulfilled or accounted for their **general education requirements**.
- Academic advisors will be familiar with **UNC Charlotte’s course catalog** and provide guidance accordingly.
- The tool will operate under the assumption that **users have access to a compatible device**.
- Students acknowledge that this planner is an **independent project** and not officially integrated with UNC Charlotte’s academic systems.
- The system will **not support direct course registration**, and students must manually enroll in classes through official university portals.

---

## Constraints

Given the scope and timeframe of the project, the following constraints have been identified:

- The project will be completed **within 16 weeks**, broken into agile sprints for efficient development.
- The planner will be **limited to undergraduate computer science majors**, with no support for interdisciplinary studies, graduate programs, or early entry pathways.
- Only **course requirements from the 2024-2025 academic catalog** will be included, ensuring focus on the most recent curriculum.
- The system will be built specifically for **UNC Charlotte** and will **not support other institutions**.
- The planner will be a **standalone tool** and will not integrate directly with UNC Charlotte’s official databases or systems.
- As we are not officially affiliated with the university, updates to **degree requirements** made by UNC Charlotte **may not be immediately reflected** in our system.

---

## Technology Stack

For the **SolarisCapstone Interactive Graduation Planner**, we have used the following technologies:

- **Frontend:**
  - HTML, CSS, JavaScript

- **Backend:**
  - Node.js with Express.js server (dockerserver.js)
  - PostgreSQL (Heroku Postgres for degree planning and course catalog)

- **Database:**
  - MySQL (JawsDB on Heroku for login system)
  - PostgreSQL (Heroku Postgres for degree planning and course catalog)

- **Tools/Other:**
  -pgAdmin 4 (PostgreSQL management GUI)

  -MySQL Workbench or VS Code Database Extensions

  -Git / GitHub for source control

  -Heroku CLI for deployment

  -Live Server (VS Code Extension for local static HTML testing)

- **Deployment:** Docker for local/remote containerization & Heroku for cloud deployments
Deployed URL:
https://teamsolariscapstone-adbfee951637.herokuapp.com/index.html

---

## Contributors

This project is a collaborative effort by UNC Charlotte Computer Science students:

- **Andrew Schmal** – Backend, Frontend, DevOps
- **Jonathan Revoir** – Role
- **Vaibhav Satheesh** – Role
- **Reid Moseley** – Role (Frontend, Backend, Database, etc.)

For any inquiries, feel free to reach out via our GitHub Discussions or email.

🚀 How to Run the Project (Setup Instructions)
1. Clone the repository (or download a zip file)

2. Install dependencies
   npm install

3. Setup the local MySQL Database
   -Create a local MySQL database named SolarisDatabase
   -Import the database/database.sql file into your MySQL server (you can use MySQL Workbench or VS Code database extension)
     Example:
     mysql -u root -p < database/database.sql
4. Set up PostgreSQL (for updated course catalog)
  -Download PostgreSQL 16.8: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

  -Install it normally and remember your password

  -Verify installation: psql --version

  -In pgAdmin 4:
      -Create a new database named solaris_capstone

      -Leave settings as default

  -In VS Code terminal (Git Bash or CMD): psql -U postgres -d solaris_capstone

  -Then inside the psql prompt: \i database/database_postgres.sql

  -You should see CREATE TABLE and INSERT statements without errors.

  5. Start the server (you can do right click -> open in live terminal on any html page).
   
    -Server should open in localhost with something like http://127.0.0.1:5500/public/degree_view.html
  
  Notes:

    -You don't need to edit .env manually for database credentials — dockerserver.js handles it.

    -MySQL is used for login system (users table).

    -PostgreSQL is used for updated degree planner catalog data.


  Optional:

    -Install VS Code extensions for easier database browsing:

    -MySQL (by cweijan)

    -PostgreSQL Management (by Chris Kolkman)



   
   

## License

This project is developed for educational purposes and is **not officially affiliated with UNC Charlotte**. All content is open-source under the MIT License.

---

## Future Goals

While this project is initially designed for UNC Charlotte, future iterations could:

- Expand to include **additional majors and interdisciplinary studies**.
- Support **other universities** with customizable degree planning.
- Integrate with official student information systems (if approved by institutions).

We look forward to improving and refining this tool to best serve students and advisors! 🚀
