const carCanvas = document.getElementById("carCanvas")
const networkCanvas = document.getElementById("networkCanvas")

carCanvas.height = window.innerHeight
carCanvas.width = 300

networkCanvas.height = window.innerHeight
networkCanvas.width = 400

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")
const CARSAMOUNT = 1000

let road = new Road(carCanvas.width / 2, carCanvas.width - 25)
let cars = generateCar(CARSAMOUNT)
let bestCar = cars[0]

let requestId

let traffic = genearateTraffice()


function generateCar(N) {
    const cars = []
    for (let i = 0; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    if (localStorage.getItem("bestBrain")) {
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain = JSON.parse(
                localStorage.getItem("bestBrain"));
            if (i != 0) {
                NeuralNetwork.mutate(cars[i].brain, 0.5);
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
    localStorage.removeItem("bestBrain")
}
function restart() {
    cancelAnimationFrame(requestId)
    cars = generateCar(CARSAMOUNT)
    road = new Road(carCanvas.width / 2, carCanvas.width - 25)
    traffic = genearateTraffice()
    gameLoop()
}


function gameLoop(time) {
    traffic.forEach((car) => {
        car.update(road.borders, [])
    })

    cars.forEach((car) => {
        car.update(road.borders, traffic)
    })
    bestCar = cars.find((c) => c.y == Math.min(...cars.map(c => c.y)))

    // if (bestCar.y < (traffic[traffic.length - 1].y - traffic[traffic.length - 1].height - 100) || cars.every((car) => car.damaged == true) || bestCar.y < -5000) {
    //     save()
    //     restart()
    // }

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

    networkCtx.lineDashOffset = time / 100
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestId = requestAnimationFrame(gameLoop)
}


gameLoop()


