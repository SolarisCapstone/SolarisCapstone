CREATE TABLE Courses (
    course_name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    type VARCHAR(255) CHECK (status IN ('Major', 'Concentration', 'Elective')) NOT NULL, 
);
begin;
insert into Courses values ('ITSC 1212', 'Introduction to Computer Science', 'Major');
insert into Courses values ('ITSC 1213', 'Introduction to Computer Science II', 'Major');
insert into Courses values ('ITSC 2214', 'Data Structures and Algorithms', 'Major');
commit;

CREATE TABLE Prerequisites (
    course_name VARCHAR(255) NOT NULL,
    prerequisite_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (course_name, prerequisite_name),
    FOREIGN KEY (course_name) REFERENCES Courses(course_name),
    FOREIGN KEY (prerequisite_name) REFERENCES Courses(course_name)
);
begin;
insert into prerequisites values ('ITSC 1213', 'ITSC 1212');
insert into prerequisites values ('ITSC 2214', 'ITSC 1213');
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
