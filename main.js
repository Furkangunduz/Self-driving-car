const canvas = document.getElementById("myCanvas")
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
const road = new Road(canvas.width / 2, canvas.width - 25)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS")
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
]


function gameLoop() {
    traffic.forEach((car) => {
        car.update(road.borders, [])
    })
    car.update(road.borders, traffic)
    canvas.height = window.innerHeight

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.7)
    road.draw(ctx)
    traffic.forEach((car) => {
        car.draw(ctx, "blue")
    })
    car.draw(ctx, "red")
    ctx.restore()


    requestAnimationFrame(gameLoop)
}


gameLoop()


