const carCanvas = document.getElementById("carCanvas")
const networkCanvas = document.getElementById("networkCanvas")

carCanvas.height = window.innerHeight
carCanvas.width = 300

networkCanvas.height = window.innerHeight
networkCanvas.width = 500

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")
const road = new Road(carCanvas.width / 2, carCanvas.width - 25)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI")
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
]


function gameLoop(time) {
    traffic.forEach((car) => {
        car.update(road.borders, [])
    })
    car.update(road.borders, traffic)
    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    carCtx.save()
    carCtx.translate(0, -car.y + carCanvas.height * 0.7)
    road.draw(carCtx)
    traffic.forEach((car) => {
        car.draw(carCtx, "blue")
    })
    car.draw(carCtx, "red")
    carCtx.restore()

    networkCtx.lineDashOffset = time / 100
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(gameLoop)
}


gameLoop()


