import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const PatentsTable = ({ searchResults, searchQuery, darkMode, sanitizeInventor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Search Results
      </h2>
      <PerfectScrollbar
        className="max-h-[49.3vh] w-full"
        options={{
          wheelSpeed: 0.5,
          wheelPropagation: false,
          suppressScrollX: false,
          suppressScrollY: false,
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-4 border-b">S. No.</th>
              <th className="p-4 border-b">Patent Number</th>
              <th className="p-4 border-b">Assignee</th>
              <th className="p-4 border-b">Inventors</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((patent, index) => (
              <tr key={patent.patent_number} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{patent.patent_number}</td>
                <td className="p-4">
                  {patent.assignee ? (
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="p-2">Organization</th>
                          <th className="p-2">City</th>
                          <th className="p-2">State</th>
                          <th className="p-2">Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2">{patent.assignee.organization}</td>
                          <td className="p-2">{patent.assignee.city || "N/A"}</td>
                          <td className="p-2">{patent.assignee.state || "N/A"}</td>
                          <td className="p-2">{patent.assignee.country}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-4">
                  {Array.isArray(patent.inventors) && patent.inventors.length > 0 ? (
                    <div className="w-full">
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        {patent.inventors.length} Inventor{patent.inventors.length > 1 ? "s" : ""}
                      </p>
                      <table className="w-full min-w-full table-auto">
                        <thead>
                          <tr>
                            <th className="p-2 border-b">S. No.</th>
                            <th className="p-2 border-b">First Name</th>
                            <th className="p-2 border-b">Last Name</th>
                            <th className="p-2 border-b">City</th>
                            <th className="p-2 border-b">State</th>
                            <th className="p-2 border-b">Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patent.inventors.map((inv, i) => {
                            const sanitizedInv = sanitizeInventor(inv);
                            return (
                              <tr key={`${patent.patent_number}-inv-${i}`} className="border-b dark:border-gray-600">
                                <td className="p-2">{i + 1}</td>
                                <td className="p-2">{sanitizedInv.first_name || "N/A"}</td>
                                <td className="p-2">{sanitizedInv.last_name || "N/A"}</td>
                                <td className="p-2">{sanitizedInv.city || "N/A"}</td>
                                <td className="p-2">{sanitizedInv.state || "N/A"}</td>
                                <td className="p-2">{sanitizedInv.country || "N/A"}</td>
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
        {searchResults.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            {searchQuery ? "No patents found" : "Enter patent numbers to search"}
          </p>
        )}
      </PerfectScrollbar>
    </div>
  );
};

export default PatentsTable;