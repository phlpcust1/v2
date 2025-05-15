import { Sidebar } from "../../components/ui/Sidebar";
import { Navbar } from "../../components/ui/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";

const CurriculumCoachesList = () => {
  const { id } = useParams(); // Get programId from URL params
  const [coaches, setCoaches] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [semesterSchoolYear, setSemesterSchoolYear] = useState("ALL");
  

  const navigate = useNavigate();

  useEffect(() => {
    setSemesterSchoolYear("ALL"); // Set default on mount
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${PORT}/programs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${PORT}/coaches`, {
          params: { filterByProgram: id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setCoaches(response.data);
        setFilteredCoaches(response.data);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    if (id) {
      fetchCoaches();
    }
  }, [id]);

  useEffect(() => {
    const results = coaches.filter(
      (coach) =>
        coach.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.coachId.toString().includes(searchQuery)
    );
    setFilteredCoaches(results);
  }, [searchQuery, coaches]);

  return (
    <div>
      <Sidebar />

      {/* Main content */}
      <div className="ml-60 bg-base-200 min-h-screen">
        <Navbar />
        <div className="p-8">
          <h1 className="font-bold text-xl mb-8 pl-4">
            List of Curriculum Coaches
          </h1>

          <div className="card bg-white w-full shadow-xl">
            <div className="card-body text-center">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
                {/* Search input */}
                <input
                  type="text"
                  placeholder="Search coaches here..."
                  className="input input-bordered w-full sm:w-72"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="flex gap-2 flex-col sm:flex-row">
                  {/* View Coaching Summary Button */}
                  <button
                   className="btn btn-sm btn-outline"
                   onClick={() => navigate("/summary?tab=summary")}
                  >
                    View Coaching Summary
                  </button>

                  {/* School Year Dropdown */}
                  <select
                    className="select select-bordered"
                    value={semesterSchoolYear}
                    onChange={(e) => setSemesterSchoolYear(e.target.value)}
                  >
                    <option value="ALL">All Semesters</option>
                    <option value="1st Sem. S/Y 2024–2025">1st Sem. S/Y 2024–2025</option>
                    <option value="2nd Sem. S/Y 2024–2025">2nd Sem. S/Y 2024–2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                    <option value="1st Sem. S/Y 2023–2024">1st Sem. S/Y 2023–2024</option>
                    <option value="2nd Sem. S/Y 2023–2024">2nd Sem. S/Y 2023–2024</option>
                    <option value="Summer 2024">Summer 2024</option>
                    <option value="1st Sem. S/Y 2022–2023">1st Sem. S/Y 2022–2023</option>
                    <option value="2nd Sem. S/Y 2022–2023">2nd Sem. S/Y 2022–2023</option>
                    <option value="Summer 2023">Summer 2023</option>
                    <option value="1st Sem. S/Y 2021–2022">1st Sem. S/Y 2021–2022</option>
                    <option value="2nd Sem. S/Y 2021–2022">2nd Sem. S/Y 2021–2022</option>
                    <option value="Summer 2022">Summer 2022</option>
                    <option value="1st Sem. S/Y 2020–2021">1st Sem. S/Y 2020–2021</option>
                    <option value="2nd Sem. S/Y 2020–2021">2nd Sem. S/Y 2020–2021</option>
                    <option value="Summer 2021">Summer 2021</option>
                  </select>
                </div>
              </div>

              {/* Coach Table */}
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Coach Name</th>
                    <th>Coach No.</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.length > 0 ? (
                    filteredCoaches.map((coach) => (
                      <tr key={coach.id}>
                        <td>
                          {coach.firstName} {coach.lastName}
                        </td>
                        <td>{coach.coachId}</td>
                        <td>{coach.email}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              navigate(`/programs/coach-details/${coach.id}`)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500">
                        No coaches found for this program.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumCoachesList;
