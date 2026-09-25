
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const dataFile = path.join(__dirname, "coffees.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getCoffees() {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function saveCoffees(coffees) {
    fs.writeFileSync(dataFile, JSON.stringify(coffees, null, 2));
}

// Get all coffees
app.get("/api/coffees", (req, res) => {
    const coffees = getCoffees();

    coffees.sort((a, b) => b.votes - a.votes);

    res.json(coffees);
});

// Vote for a coffee
app.post("/api/coffees/:id/vote", (req, res) => {
    const coffees = getCoffees();
    const coffeeId = parseInt(req.params.id);

    const coffee = coffees.find(item => item.id === coffeeId);

    if (!coffee) {
        return res.status(404).json({
            error: "Coffee not found"
        });
    }

    coffee.votes += 1;

    saveCoffees(coffees);

    res.json({
        message: "Vote recorded successfully",
        coffee: coffee
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coffee Rating App running on port ${PORT}`);
});
