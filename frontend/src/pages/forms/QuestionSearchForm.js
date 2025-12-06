import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryAPI, questionAPI } from "../../services/api";
import "../../styles/QuestionSearchForm.css";

const QuestionSearchForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMains, setSelectedMains] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      })
      .catch(console.error);
  }, []);

  const toggle = (value, listSetter) => {
    listSetter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleMainChange = (main) => {
    toggle(main, setSelectedMains);
    setSelectedSubs([]);
  };

  const uniqueMains = [...new Set(categories.map((c) => c.main))];

  const uniqueSubs = categories
    .filter((c) => selectedMains.includes(c.main))
    .map((c) => c.name);

  const validate = () => {
    const e = {};
    if (!selectedMains.length) e.main = "Select at least one main category";
    if (!selectedSubs.length) e.sub = "Select at least one sub category";
    if (!selectedDifficulty.length)
      e.difficulty = "Select at least one difficulty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await questionAPI.search({
        category: selectedSubs.join(","),
        difficulty: selectedDifficulty.join(","),
      });

      navigate("/results", {
        state: {
          selectedSubs: selectedSubs,
          selectedDifficulty: selectedDifficulty,
        },
      });
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <h2>Search Questions</h2>

        <div className="form-section">
          <h3>Main Category</h3>
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
          <h3>Sub Category</h3>
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
          <h3>Difficulty</h3>
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
