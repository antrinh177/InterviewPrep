import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryAPI, questionAPI } from "../../services/api";
import "../../styles/QuestionSearchForm.css";

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
    categoryAPI
      .getAll()
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
      await questionAPI.search({
        category: selectedSubs.join(","),
        difficulty: selectedDifficulty.join(","),
      });
      // navigate to results page with the selected filters
      navigate("/results", { 
        state: { 
          selectedSubs: selectedSubs,
          selectedDifficulty: selectedDifficulty
        }
      });
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <h2>Find Practice Questions</h2>

        <div className="form-section">
          <h4>Main Category</h4>
          {uniqueMains.map((main) => (
            <label key={main} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedMains.includes(main)}
                onChange={() => handleMainChange(main)}
              />
              {main}
            </label>
          ))}
          {errors.main && <p className="error">{errors.main}</p>}
        </div>

        <div className="form-section">
          <h4>Sub Category</h4>
          {selectedMains.length === 0 ? (
            <p className="hint">
              Please select at least one Main Category first
            </p>
          ) : (
            uniqueSubs.map((sub) => (
              <label key={sub} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSubs.includes(sub)}
                  onChange={() => toggle(sub, setSelectedSubs)}
                />
                {sub}
              </label>
            ))
          )}
          {errors.sub && <p className="error">{errors.sub}</p>}
        </div>

        <div className="form-section">
          <h4>Difficulty</h4>
          {["Easy", "Medium", "Hard"].map((level) => (
            <label key={level} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedDifficulty.includes(level)}
                onChange={() => toggle(level, setSelectedDifficulty)}
              />
              {level}
            </label>
          ))}
          {errors.difficulty && <p className="error">{errors.difficulty}</p>}
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default QuestionSearchForm;
