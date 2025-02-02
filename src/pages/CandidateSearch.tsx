import { useState, useEffect } from "react";
import { searchGithub } from "../api/API";
import { Candidate } from "../interfaces/Candidate.interface";

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null,
  );
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [noMoreCandidates, setNoMoreCandidates] = useState(false);

  // Load saved candidates from localStorage 
  useEffect(() => {
    const saved = localStorage.getItem("savedCandidates");
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    }
    fetchCandidates();
  }, []);

  // Fetch random list of candidates
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await searchGithub();
      setCandidates(data);
      setCurrentCandidate(data[0] || null);
      setNoMoreCandidates(data.length === 0);
    } catch (error) {
      console.error("Error fetching candidates", error);
    } finally {
      setLoading(false);
    }
  };

  // Save candidate and go to next
  const saveCandidate = () => {
    if (currentCandidate) {
      const updatedSavedCandidates = [...savedCandidates, currentCandidate];
      setSavedCandidates(updatedSavedCandidates);
      localStorage.setItem(
        "savedCandidates",
        JSON.stringify(updatedSavedCandidates),
      );
    }
    moveToNextCandidate();
  };

  // Skip the candidate and go to the next
  const skipCandidate = () => {
    moveToNextCandidate();
  };

  // Move to next candidate or show no more
  const moveToNextCandidate = () => {
    const nextIndex = candidates.indexOf(currentCandidate!) + 1;
    if (nextIndex < candidates.length) {
      setCurrentCandidate(candidates[nextIndex]);
    } else {
      setCurrentCandidate(null);
      setNoMoreCandidates(true);
    }
  };

  return (
    <div>
      <h1>Candidate Search</h1>
      <main>
        {loading && <p>Loading...</p>}
        {noMoreCandidates && <p>No more candidates available for review.</p>}

        {currentCandidate && (
          <div>
            <img
              src={currentCandidate.avatar_url}
              alt={currentCandidate.login}
              width={100}
            />
            <p>
              <strong>Name:</strong> {currentCandidate.name || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {currentCandidate.login}
            </p>
            <p>
              <strong>Location:</strong> {currentCandidate.location || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {currentCandidate.email || "N/A"}
            </p>
            <p>
              <strong>Company:</strong> {currentCandidate.company || "N/A"}
            </p>
            <p>
              <strong>Bio:</strong> {currentCandidate.bio || "N/A"}
            </p>
            <a
              href={currentCandidate.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub Profile
            </a>

            <div>
              <button onClick={saveCandidate}>+</button>
              <button onClick={skipCandidate}>-</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateSearch;