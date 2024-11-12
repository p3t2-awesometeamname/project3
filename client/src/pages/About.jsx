import React from 'react';
import './About.css';

const developers = [
  {
    name: "Chad Young",
    image: "/images/camera.jpg",
    bio: "I’m Chad, an engineer passionate about designing and building end-to-end web applications that are both functional and visually appealing. With expertise in front-end frameworks and back-end development.",
    github: "https://github.com/chadyoung",
    email: "mailto:chad@example.com",
    website: "https://chadyoung.com"
  },
  {
    name: "Max Laskey",
    image: "/images/teddy-bear.jpg",
    bio: "I'm Max, a full stack web developer focused on creating responsive, user-friendly web applications. With skills in both front-end and back-end development, I turn ideas into functional, polished experiences.",
    github: "https://github.com/maxlaskey",
    email: "mailto:max@example.com",
    website: "https://maxlaskey.com"
  },
  {
    name: "Trey Wayland",
    image: "/images/soap.jpg",
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
                <i className="fab fa-github"></i>
              </a>
              <a href={dev.email}>
                <i className="fas fa-envelope"></i>
              </a>
              <a href={dev.website} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;