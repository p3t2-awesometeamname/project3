import Jumbotron from "../components/Jumbotron";
import TicTacToe from "../components/Tictactoe/Tictactoe";

const About = () => {
  return (
    <div>
      <Jumbotron>
        <h1>ABOUT</h1>
        <p>All about the creators of this project</p>
      </Jumbotron>
      <TicTacToe />
    </div>
  );
};

export default About;
