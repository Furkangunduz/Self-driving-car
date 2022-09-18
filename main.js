const carCanvas = document.getElementById("carCanvas")
const networkCanvas = document.getElementById("networkCanvas")

carCanvas.height = window.innerHeight
carCanvas.width = 300

networkCanvas.height = window.innerHeight
networkCanvas.width = 400

const FPS = 60
const CARSAMOUNT = 100
const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

let road = new Road(carCanvas.width / 2, carCanvas.width - 25)
let roadLaneCenters = getAllLanesCenterCoordinates()

let cars = generateCar(CARSAMOUNT)
let bestCar = cars[0]
let traffic = genearateTraffice()

let intervalId
let generationCount = 0
let alive = cars.length
var mutation_rate = 0.15

let visualizerAnim = 1

function generateCar(N) {
    const cars = []
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    if (localStorage.getItem("bestBrain")) {
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain = JSON.parse(
                localStorage.getItem("bestBrain"));
            if (i != 0) {
                NeuralNetwork.mutate(cars[i].brain, mutation_rate);
            }
        }
    }
    return cars
}
function genearateTraffice() {
    let traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(2), -800, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(0), -1500, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(1), -1800, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(0), -2000, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(2), -2000, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(1), -2200, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(0), -2500, 30, 50, "DUMMY", 3),
        new Car(road.getLaneCenter(2), -2500, 30, 50, "DUMMY", 3),
    ]
    return traffic
}
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}
function discard() {
    generationCount = 0
    localStorage.removeItem("bestBrain")
}
function restart() {
    clearInterval(intervalId);
    generationCount++
    cars = generateCar(CARSAMOUNT)
    road = new Road(carCanvas.width / 2, carCanvas.width - 25)
    traffic = genearateTraffice()
    gameLoop()
}
function clearLowSpeedCars() {
    setInterval(() => {
        console.log("clearing zero speed cars")
        cars = cars.filter((car) => !(Math.abs(car.speed) <= 3) || car.damaged)
    }, 6000)
}
function getAllLanesCenterCoordinates() {
    let centers = []
    for (let i = 0; i < road.laneCount; i++) {
        centers.push(road.getLaneCenter(i))
    }
    return centers
}
function gameLoop() {
    intervalId = setInterval(() => {
        traffic.forEach((car) => {
            car.update(road.borders, [])
        })
        cars.forEach((car) => {
            car.update(road.borders, traffic, roadLaneCenters)
        })
        bestCar = cars.find((c) => c.y == Math.min(...cars.map(c => c.y)))
        alive = cars.length - cars.filter(x => x.damaged == true).length

        if (alive == 0) {
            save()
            restart()
        }

        carCanvas.height = window.innerHeight
        networkCanvas.height = window.innerHeight

        carCtx.save()
        carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
        road.draw(carCtx)

        traffic.forEach((car) => {
            car.draw(carCtx, "blue")
        })

        carCtx.globalAlpha = 0.2
        cars.forEach((car) => {
            car.draw(carCtx, "red")
        })
        carCtx.globalAlpha = 1
        bestCar.draw(carCtx, "red", true)

        carCtx.restore()

        visualizerAnim += 0.4 % 10
        networkCtx.lineDashOffset = visualizerAnim
        Visualizer.drawNetwork(networkCtx, bestCar.brain);
        carCtx.font = '20px serif';
        carCtx.fillText(`generation : ${generationCount}`, 20, 30);
        carCtx.fillText(`alive : ${alive}`, 20, 70);
    }, 1000 / FPS)
}

gameLoop()
clearLowSpeedCars()


