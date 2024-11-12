import React from 'react';
import './About.css';
import maxImage from '../assets/Max-Prof.png';
import treyImage from '../assets/Trey-Prof.png';
import chadImage from '../assets/Chad-Prof.png';

const developers = [
  {
    name: "Chad Young",
    image: chadImage,
    bio: "I’m Chad, an enigneer passionate about designing and building end-to-end web applications that are both functional and visually appealing. With expertise in front-end frameworks and back-end development.",
    github: "https://github.com/Wrandy1",
    email: "mailto:cjyoung0420@gmail.com",
    website: "https://chadyoung.com"
  },
  {
    name: "Max LC",
    image: maxImage,
    bio: "I'm Max, a full stack web developer focused on creating responsive, user-friendly web applications. With skills in both front-end and back-end development, I turn ideas into functional, polished experiences.",
    github: "https://github.com/MaxLC00",
    email: "mailto:maxelaskey@gmail.com",
    website: "https://maxlc-portfolio.netlify.app/"
  },
  {
    name: "Trey Wayland",
    image: treyImage,
    bio: "I’m Trey, web developer passionate about building seamless, user-friendly applications from the ground up. With a strong foundation in front-end technologies like JavaScript and React, and back-end experience in Node.js and database management.",
    github: "https://github.com/treywayland",
    email: "mailto:trey@example.com",
    website: "https://treywayland.com"
  }
];

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <div className="developers-container">
        {developers.map((dev, index) => (
          <div key={index} className="developer-card">
            <img src={dev.image} alt={`${dev.name}'s profile`} className="developer-image" />
            <h2>{dev.name}</h2>
            <p>{dev.bio}</p>
            <div className="developer-links">
              <a href={dev.github} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github">Github</i>
              </a>
              <a href={dev.email}>
                <i className="fas fa-envelope">Email</i>
              </a>
              <a href={dev.website} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe">Website</i>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
