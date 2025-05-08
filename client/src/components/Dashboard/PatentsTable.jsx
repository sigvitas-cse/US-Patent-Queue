import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const PatentsTable = ({ searchResults, searchQuery, darkMode, sanitizeInventor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-3 sm:p-4 mt-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
        Search Results
      </h2>
      <PerfectScrollbar
        className="max-h-[60vh] w-full"
        options={{
          wheelSpeed: 0.5,
          wheelPropagation: false,
          suppressScrollX: false,
          suppressScrollY: false,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-1 sm:p-2 border-b">S. No.</th>
                <th className="p-1 sm:p-2 border-b">Patent Number</th>
                <th className="p-1 sm:p-2 border-b">Assignee</th>
                <th className="p-1 sm:p-2 border-b">Inventors</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((patent, index) => (
                <tr key={patent.patent_number} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-1 sm:p-2">{index + 1}</td>
                  <td className="p-1 sm:p-2">{patent.patent_number}</td>
                  <td className="p-1 sm:p-2">
                    {patent.assignee ? (
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            <th className="p-1">Organization</th>
                            <th className="p-1 hidden sm:table-cell">City</th>
                            <th className="p-1 hidden sm:table-cell">State</th>
                            <th className="p-1 hidden sm:table-cell">Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1">{patent.assignee.organization}</td>
                            <td className="p-1 hidden sm:table-cell">{patent.assignee.city || "N/A"}</td>
                            <td className="p-1 hidden sm:table-cell">{patent.assignee.state || "N/A"}</td>
                            <td className="p-1 hidden sm:table-cell">{patent.assignee.country}</td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-1 sm:p-2">
                    {Array.isArray(patent.inventors) && patent.inventors.length > 0 ? (
                      <div className="w-full">
                        <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                          {patent.inventors.length} Inventor{patent.inventors.length > 1 ? "s" : ""}
                        </p>
                        <table className="w-full min-w-full table-auto text-xs">
                          <thead>
                            <tr>
                              <th className="p-1 border-b">S. No.</th>
                              <th className="p-1 border-b">First Name</th>
                              <th className="p-1 border-b">Last Name</th>
                              <th className="p-1 border-b hidden sm:table-cell">City</th>
                              <th className="p-1 border-b hidden sm:table-cell">State</th>
                              <th className="p-1 border-b hidden sm:table-cell">Country</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patent.inventors.map((inv, i) => {
                              const sanitizedInv = sanitizeInventor(inv);
                              return (
                                <tr key={`${patent.patent_number}-inv-${i}`} className="border-b dark:border-gray-600">
                                  <td className="p-1">{i + 1}</td>
                                  <td className="p-1">{sanitizedInv.first_name || "N/A"}</td>
                                  <td className="p-1">{sanitizedInv.last_name || "N/A"}</td>
                                  <td className="p-1 hidden sm:table-cell">{sanitizedInv.city || "N/A"}</td>
                                  <td className="p-1 hidden sm:table-cell">{sanitizedInv.state || "N/A"}</td>
                                  <td className="p-1 hidden sm:table-cell">{sanitizedInv.country || "N/A"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      "No inventors"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {searchResults.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-3 text-sm">
            {searchQuery ? "No patents found" : "Enter patent numbers to search"}
          </p>
        )}
      </PerfectScrollbar>
    </div>
  );
};

export default PatentsTable;