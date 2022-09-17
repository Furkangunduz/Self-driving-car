const canvas = document.getElementById("myCanvas")
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
const road = new Road(canvas.width / 2, canvas.width - 10)
const car = new Car(road.getLaneCenter(1), 100, 30, 50)


function gameLoop() {
    car.update()

    canvas.height = window.innerHeight

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.7)


    road.draw(ctx)
    car.draw(ctx)
    ctx.restore()

    requestAnimationFrame(gameLoop)
}


gameLoop()

