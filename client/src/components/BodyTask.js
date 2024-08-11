import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App_comp.css"; // Custom styles if any

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
    <div className="container my-4">
      <h1 className="mb-4">Leading Cryptocurrencies</h1>
      <div className="d-flex justify-content-between mb-4">
        <input
          type="text"
          // className="form-control w-25"
          style={{ width: "50px" }} /* Adjust width as needed */
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="rowsPerPage" className="form-label me-2">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            className="form-select"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <div className="table-wrapper">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th className="table-fixed" onClick={() => handleSort("rank")}>
                  Rank{getSortIcon("rank")}
                </th>
                <th onClick={() => handleSort("name")}>
                  Name{getSortIcon("name")}
                </th>
                <th onClick={() => handleSort("marketCap")}>
                  Market Cap{getSortIcon("marketCap")}
                </th>
                <th onClick={() => handleSort("price")}>
                  Price{getSortIcon("price")}
                </th>
                <th onClick={() => handleSort("todayChange")}>
                  Today{getSortIcon("todayChange")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoins.map((coin) => (
                <tr key={coin.symbol}>
                  <td className="table-fixed">{coin.rank}</td>
                  <td>
                    <img
                      src={coin.logo}
                      alt={coin.name}
                      className="me-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <span className="fw-bold">{coin.name}</span>
                    <br />
                    <span className="text-muted">{coin.symbol}</span>
                  </td>
                  <td>${coin.marketCap.toLocaleString()}</td>
                  <td>${coin.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        coin.todayChange >= 0 ? "text-success" : "text-danger"
                      }
                    >
                      {coin.todayChange > 0 ? "+" : ""}
                      {coin.todayChange.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button
          className={`btn btn-outline-secondary me-2 ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="align-self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`btn btn-outline-secondary ms-2 ${
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
