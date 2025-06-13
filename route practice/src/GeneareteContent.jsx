import axios from "axios"
import { useState } from "react";

export default function GeneareteContent() 
{
    
const [question, setQuestion] = useState("");
const Generate = async (e) => {
  try {
    e.preventDefault();
    console.log(question);
    const resp = await axios.post(
      "http://localhost:3000/user/GenerateData",
      { question: question },
      { withCredentials: true }
    );
    console.log(resp);
    console.log(resp.data);
    // Generate content logic her
  } catch (error) {
    console.log(error);
    console.log("Failed to generate content");
  }
  return (
    <>
      <input
        type="text"
        placeholder="Ener your input to generate teh content "
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={Generate}>Generate</button>
    </>
  );
};
}