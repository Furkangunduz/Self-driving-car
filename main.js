const canvas = document.getElementById("myCanvas")
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
const car = new Car(100, 100, 30, 50)


function gameLoop() {
    canvas.height = window.innerHeight

    car.update()
    car.draw(ctx)
    requestAnimationFrame(gameLoop)
}


gameLoop()


