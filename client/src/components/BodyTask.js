import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App_comp.css"; // Ensure this CSS file includes the pagination styles
import "react-datepicker/dist/react-datepicker.css";

const COINGECKO_API_URL = `https://api.coingecko.com/api/v3/coins/markets`; // URL to CoinGecko API

const fetchWithRetry = async (retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(COINGECKO_API_URL, {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
        },
      });
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn(`Rate limit hit, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Other errors are not retried
      }
    }
  }
  throw new Error("Failed to fetch data after several retries.");
};

function BodyTask() {
  const [coinsData, setCoinsData] = useState([]);
  const [sortColumn, setSortColumn] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        const response = await fetchWithRetry();
        const coins = response.data.map((coin) => ({
          rank: coin.market_cap_rank,
          name: coin.name,
          symbol: coin.symbol,
          logo: coin.image, // CoinGecko API provides logo URLs in `image`
          marketCap: coin.market_cap,
          price: coin.current_price,
          todayChange: coin.price_change_percentage_24h,
        }));

        setCoinsData(coins);
        setTotalPages(Math.ceil(coins.length / rowsPerPage)); // Set total pages for pagination
      } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
      }
    };

    fetchCoinsData();
  }, [rowsPerPage]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  const filteredCoins = coinsData.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    let comparison = 0;
    switch (sortColumn) {
      case "rank":
      case "marketCap":
      case "price":
        comparison = a[sortColumn] - b[sortColumn];
        break;
      case "name":
      case "symbol":
        comparison = a[sortColumn].localeCompare(b[sortColumn]);
        break;
      case "todayChange":
        comparison = a.todayChange - b.todayChange;
        break;
      default:
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCoins = sortedCoins.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page on rows per page change
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Leading Cryptocurrencies</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "20px" }} // Adjust width and margin
        />
        <div style={{ marginLeft: "auto" }}>
          <label htmlFor="rowsPerPage" style={{ marginRight: "10px" }}>
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{ padding: "10px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6c757d",
                borderBottom: "2px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("rank")}
            >
              Rank{getSortIcon("rank")}
            </th>
            <th
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6c757d",
                borderBottom: "2px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("name")}
            >
              Name{getSortIcon("name")}
            </th>
            <th
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6c757d",
                borderBottom: "2px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("marketCap")}
            >
              Market Cap{getSortIcon("marketCap")}
            </th>
            <th
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6c757d",
                borderBottom: "2px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("price")}
            >
              Price{getSortIcon("price")}
            </th>
            <th
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6c757d",
                borderBottom: "2px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("todayChange")}
            >
              Today{getSortIcon("todayChange")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedCoins.map((coin) => (
            <tr key={coin.symbol}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #dee2e6",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {coin.rank}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #dee2e6",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                <img
                  src={coin.logo}
                  alt={coin.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                    verticalAlign: "middle",
                  }}
                />
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {coin.name}
                </span>
                <br />
                <span style={{ color: "#6c757d", fontSize: "14px" }}>
                  {coin.symbol}
                </span>
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #dee2e6",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                ${coin.marketCap.toLocaleString()}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #dee2e6",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                ${coin.price.toFixed(2)}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #dee2e6",
                  fontSize: "14px",
                  textAlign: "center",
                  color: coin.todayChange >= 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {coin.todayChange > 0 ? "+" : ""}
                {coin.todayChange.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="pagination-container"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <button
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`pagination-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BodyTask;
