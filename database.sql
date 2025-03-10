CREATE TABLE Courses (
    course_name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    type VARCHAR(255) CHECK (status IN ('Core', 'Mathematics and Statistics', 'Capstone', 'Conc Required', 'Conc Elective', 'Conc Tech Elective')) NOT NULL, 
);
begin;
INSERT INTO Courses (course_name, description, type) VALUES
    ('ITSC 1212', 'Introduction to Computer Science', 'Core'),
    ('ITSC 1213', 'Introduction to Computer Science II', 'Core'),
    ('ITSC 2214', 'Data Structures and Algorithms', 'Core'),
    ('ITSC 1110', 'Introduction to Computer Science Principles', 'Core'),
    ('ITSC 1200', 'Freshman Seminar', 'Core'),
    ('ITSC 1501', 'Global Social Science: Interconnected World of Technology', 'Core'),
    ('ITSC 1600', 'Computing Professionals', 'Core'),
    ('ITSC 2175', 'Logic and Algorithms', 'Core'),
    ('ITSC 2181', 'Introduction to Computer Systems', 'Core'),
    ('ITSC 2600', 'Computer Science Program, Identity, Career', 'Core'),
    ('ITSC 3146', 'Intro Operating Systems & Networking', 'Core'),
    ('ITSC 3155', 'Software Engineering', 'Core'),
    ('ITSC 3688', 'Computers and their Impact on Society', 'Core'),
    ('ITSC 3790', 'Honors Research', 'Core'),
    ('ITSC 3990', 'Undergraduate Research', 'Core'),
    ('ITSC 4155', 'Software Development Projects', 'Capstone'),
    ('ITSC 4681', 'Senior Design I', 'Capstone'),
    ('ITSC 4750', 'Honors Thesis', 'Capstone'),
    ('ITSC 4850', 'Senior Project I', 'Capstone'),
    ('ITSC 4851', 'Senior Project II', 'Capstone'),
    ('ITCS 3050', 'Topics in Computer Science', 'Core'),
    ('ITCS 3112', 'Design and Implementation of Object-Oriented Systems', 'Core'),
    ('ITCS 3120', 'Intro to Interactive Computer Graphics', 'Core'),
    ('ITCS 3153', 'Intro to Artificial Intelligence', 'Core'),
    ('ITCS 3156', 'Intro to Machine Learning', 'Core'),
    ('ITCS 3160', 'Database Design and Implementation', 'Core'),
    ('ITCS 3162', 'Intro to Data Mining', 'Core'),
    ('ITCS 3166', 'Intro to Computer Networks', 'Core'),
    ('ITCS 3190', 'Cloud Computing for Data Analysis', 'Core'),
    ('ITCS 3216', 'Intro to Cognitive Science', 'Core'),
    ('ITCS 4010', 'Topics in Computer Science', 'Core'),
    ('ITCS 4102', 'Programming Languages', 'Core'),
    ('ITCS 4114', 'Real World Algorithms', 'Core'),
    ('ITCS 4122', 'Visual Analytics', 'Core'),
    ('ITCS 4141', 'Computer Systems and Architecture', 'Core'),
    ('ITCS 4145', 'Parallel Programming', 'Core'),
    ('ITCS 4151', 'Intelligent Robotics', 'Core'),
    ('ITCS 4152', 'Intro to Computer Vision', 'Core'),
    ('ITCS 4180', 'Mobile Application Development', 'Core'),
    ('ITCS 4230', 'Intro to Game Design and Development', 'Core'),
    ('ITCS 4231', 'Advanced Game Design and Development', 'Core'),
    ('ITCS 4232', 'Game Design and Development Studio', 'Core')
    ('ITIS 3130', 'Intro to Human-Centered Computing', 'Core'),
    ('ITIS 3135', 'Web-based Application Design and Development', 'Core'),
    ('ITIS 3200', 'Intro to Info Security & Privacy', 'Core'),
    ('ITIS 3216', 'Intro to Cognitive Science', 'Core'),
    ('ITIS 3246', 'IT Infrastructure and SEC', 'Core'),
    ('ITIS 3300', 'Software Req and Project Management', 'Core'),
    ('ITIS 3310', 'Software Arch and Design', 'Core'),
    ('ITIS 3320', 'Intro to Info Security & Privacy', 'Core'),
    ('ITIS 4010', 'Topics in Software & Info Sys', 'Core'),
    ('ITIS 4166', 'Network-Based App Development', 'Core'),
    ('ITIS 4180', 'Mobile Application Development', 'Core'),
    ('ITIS 4214', 'Usable Security and Privacy', 'Core'),
    ('ITIS 4221', 'Secure Programming and Penetration Testing', 'Core'),
    ('ITIS 4246', 'Competitive Cyber Defense', 'Core'),
    ('ITIS 4250', 'Computer Forensics', 'Core'),
    ('ITIS 4260', 'Intro to Security Analysis', 'Core'),
    ('ITIS 4261', 'Intro to Secured Cloud Computing', 'Core'),
    ('ITIS 4350', 'Design Prototyping', 'Core'),
    ('ITIS 4360', 'Human-Centered Artificial Intelligence', 'Core'),
    ('ITIS 4390', 'Interaction Design Projects', 'Core');
commit;

CREATE TABLE Prerequisites (
    course_name VARCHAR(255) NOT NULL,
    prerequisite_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (course_name, prerequisite_name),
    FOREIGN KEY (course_name) REFERENCES Courses(course_name),
    FOREIGN KEY (prerequisite_name) REFERENCES Courses(course_name)
);
begin;
INSERT INTO Prerequisites (course_name, prerequisite_name) VALUES
    ('ITSC 1213', 'ITSC 1212'),
    ('ITSC 2175', 'ITSC 1212'),
    ('ITSC 2181', 'ITSC 1212'),
    ('ITSC 2214', 'ITSC 1213'),
    ('ITSC 3146', 'ITSC 2214'),
    ('ITSC 3146', 'ITSC 2181'),
    ('ITSC 3155', 'ITSC 2214'),
    ('ITSC 4155', 'ITSC 2214'),
    ('ITSC 4155', 'ITSC 3155'),
    ('ITCS 3112', 'ITSC 2214'),
    ('ITCS 3120', 'ITSC 2214'),
    ('ITCS 3153', 'MATH2164'),
    ('ITCS 3153', 'ITSC 2214'),
    ('ITCS 3156', 'MATH2164'),
    ('ITCS 3156', 'ITSC 2214'),
    ('ITCS 3160', 'ITSC 1213'),
    ('ITCS 3162', 'ITSC 2214'),
    ('ITCS 3166', 'ITSC 1213'),
    ('ITCS 3190', 'ITSC 2214'),
    ('ITCS 3216', 'PSYCH1101'),
    ('ITCS 4010', 'ITSC 2214'),
    ('ITCS 4102', 'ITSC 2214'),
    ('ITCS 4114', 'ITSC 2214'),
    ('ITCS 4114', 'ITSC 2175'),
    ('ITCS 4122', 'STAT1220'),
    ('ITCS 4141', 'ITSC 3146'),
    ('ITCS 4145', 'ITSC 3146'),
    ('ITCS 4151', 'ITSC 2214'),
    ('ITCS 4151', 'MATH2164'),
    ('ITCS 4152', 'ITSC 3156'),
    ('ITCS 4180', 'ITSC 2214'),
    ('ITCS 4230', 'ITSC 2214'),
    ('ITCS 4231', 'ITCS 4230'),
    ('ITCS 4232', 'ITSC 3155'),
    ('ITCS 4232', 'ITCS 4231')
    ('ITIS 3135', 'ITSC 2214'),
    ('ITIS 3200', 'ITSC 2214'),
    ('ITIS 3216', 'PSYCH1101'),
    ('ITIS 3246', 'ITSC 3146'),
    ('ITIS 3300', 'ITIS 2300'),
    ('ITIS 3300', 'ITIS 3135'),
    ('ITIS 3310', 'ITSC 2214'),
    ('ITIS 3320', 'ITIS 3200'),
    ('ITIS 3320', 'ITIS 3300'),
    ('ITIS 4166', 'ITIS 2300'),
    ('ITIS 4166', 'ITCS 3160'),
    ('ITIS 4180', 'ITSC 2214'),
    ('ITIS 4221', 'ITIS 3135'),
    ('ITIS 4221', 'ITIS 2300'),
    ('ITIS 4246', 'ITIS 3200'),
    ('ITIS 4246', 'ITIS 3246'),
    ('ITIS 4250', 'ITIS 2300'),
    ('ITIS 4250', 'ITIS 3150'),
    ('ITIS 4260', 'ITIS 3200'),
    ('ITIS 4260', 'ITSC 3146'),
    ('ITIS 4260', 'STAT 1220'),
    ('ITIS 4261', 'ITSC 3146');
commit;

CREATE TABLE Catalogs (
    catalog_id INT PRIMARY KEY,
    catalog_name VARCHAR(255) NOT NULL,
    description TEXT,
);
begin;
insert into Catalogs values (1, 'Computer Science', 'Computer Science Major');
insert into Catalogs values (2, 'Data Science ', 'Data Science Concentration');
commit;

CREATE TABLE CatalogCourses (
    catalog_id INT,
    course_name VARCHAR(255),
    PRIMARY KEY (catalog_id, course_name),
    FOREIGN KEY (catalog_id) REFERENCES Catalogs(catalog_id),
    FOREIGN KEY (course_name) REFERENCES Courses(course_name)
);
begin;
insert into CatalogCourses values (1, 'ITSC 1212');
insert into CatalogCourses values (1, 'ITSC 1213');
insert into CatalogCourses values (1, 'ITSC 2214');
commit;
