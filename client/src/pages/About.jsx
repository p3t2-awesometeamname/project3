import React from "react";  

const authors = [
  {
    name: "Author 1",
    bio: "This is a short bio of Author 1.",
    image: "path/to/author1.jpg"
  },
  {
    name: "Author 2",
    bio: "This is a short bio of Author 2.",
    image: "path/to/author2.jpg"
  }
  // Add more authors as needed
];

const About = () => {
  return (
    <div>
      <h1>About Us</h1>
      {authors.map((author, index) => (
        <div key={index} className="author">
          <img src={author.image} alt={`${author.name}'s picture`} />
          <h2>{author.name}</h2>
          <p>{author.bio}</p>
        </div>
      ))}
    </div>
  );
};

export default About;