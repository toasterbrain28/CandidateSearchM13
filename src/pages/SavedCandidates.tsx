import { useState, useEffect } from "react";
import { Candidate } from "../interfaces/Candidate.interface";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedCandidates");
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    }
  }, []);

  // Function to delete a candidate
  const deleteCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== id,
    );
    setSavedCandidates(updatedCandidates);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
  };

  return (
    <div>
      <h1>Saved Candidates</h1>

      {savedCandidates.length === 0 ? (
        <p>No candidates have been accepted yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Username</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Profile</th>
              <th>Action</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <img
                    src={candidate.avatar_url}
                    alt={candidate.login}
                    width={50}
                  />
                </td>
                <td>{candidate.name || "N/A"}</td>
                <td>{candidate.login}</td>
                <td>{candidate.location || "N/A"}</td>
                <td>{candidate.email || "N/A"}</td>
                <td>{candidate.company || "N/A"}</td>
                <td>{candidate.bio || "No bio available"}</td>
                <td>
                  <a
                    href={candidate.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Profile
                  </a>
                </td>
                <td>
                  <button onClick={() => deleteCandidate(candidate.id)}>
                    Delete
                  </button>{" "}
                  {/* Delete button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedCandidates;