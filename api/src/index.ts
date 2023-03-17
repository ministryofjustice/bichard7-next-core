import app from "./app"

const PORT: string = process.env.PORT || "6000"

app.listen(PORT, () => console.log(`app is listening on ${PORT}`))
