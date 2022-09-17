class Controls {
    constructor() {
        this.forward = false
        this.right = false
        this.left = false
        this.reverse = false

        this.#addKeyboardListeners()
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true
                    break
                case "ArrowRight":
                    this.right = true
                    break
                case "ArrowDown":
                    this.reverse = true
                    break
                case "ArrowUp":
                    this.forward = true
                    break
            }
            // console.table(this)
        }

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false
                    break
                case "ArrowRight":
                    this.right = false
                    break
                case "ArrowDown":
                    this.reverse = false
                    break
                case "ArrowUp":
                    this.forward = false
                    break
            }
            // console.table(this)
        }
    }
}