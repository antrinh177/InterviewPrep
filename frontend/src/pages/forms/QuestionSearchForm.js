import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuestionSearchForm = () => {
  // State for all categories fetched from the server
  const [categories, setCategories] = useState([]);
  const [selectedMains, setSelectedMains] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // fetch categories from backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/categories") // localhost:3000 is used in front-end and crushed
      .then((res) => {
        // ensure data is an array
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      })
      .catch(console.error);
  }, []);

  // toggle value in a checkbox list
  const toggle = (value, listSetter) => {
    listSetter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // when main category changes, toggle it and reset subcategories
  const handleMainChange = (main) => {
    toggle(main, setSelectedMains);
    setSelectedSubs([]);
  };

  // show unique main categories
  const uniqueMains = [...new Set(categories.map((c) => c.main))];

  // show subcategories based on selected main categories
  const uniqueSubs = categories
    .filter((c) => selectedMains.includes(c.main))
    .map((c) => c.name);

  // validation before submitting the form
  const validate = () => {
    const e = {};
    if (!selectedMains.length) e.main = "Select at least one main category";
    if (!selectedSubs.length) e.sub = "Select at least one sub category";
    if (!selectedDifficulty.length)
      e.difficulty = "Select at least one difficulty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // fetch search results from backend
      const res = await axios.get("http://localhost:5000/questions/search", {
        params: {
          name: selectedSubs.join(","), // send subcategories as CSV
          difficulty: selectedDifficulty.join(","), // send difficulty as CSV
        },
      });

      // navigate to results page with the search results
      navigate("/result", { state: { results: res.data } });
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Main Category Checkboxes */}
      <h3>Main Category</h3>
      {uniqueMains.map((main) => (
        <label key={main} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedMains.includes(main)}
            onChange={() => handleMainChange(main)}
          />
          {main}
        </label>
      ))}
      {errors.main && <p style={{ color: "red" }}>{errors.main}</p>}

      {/* Sub Category Checkboxes */}
      <h3>Sub Category</h3>
      {selectedMains.length === 0 ? (
        <p>Please select at least one Main Category first</p>
      ) : (
        uniqueSubs.map((sub) => (
          <label key={sub} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedSubs.includes(sub)}
              onChange={() => toggle(sub, setSelectedSubs)}
            />
            {sub}
          </label>
        ))
      )}
      {errors.sub && <p style={{ color: "red" }}>{errors.sub}</p>}

      {/* Difficulty Checkboxes */}
      <h3>Difficulty</h3>
      {["Easy", "Medium", "Hard"].map((level) => (
        <label key={level} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedDifficulty.includes(level)}
            onChange={() => toggle(level, setSelectedDifficulty)}
          />
          {level}
        </label>
      ))}
      {errors.difficulty && <p style={{ color: "red" }}>{errors.difficulty}</p>}

      {/* Submit button */}
      <button type="submit">Search</button>
    </form>
  );
};

export default QuestionSearchForm;
