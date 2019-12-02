/**
 * Generates a random hexadecimal value.
 * @returns {string}
 */
function getRandomColor () {
  /**
   * @type {string}
   */
  let color = '#'

  /**
   * @type {string}
   */
  const letters = '0123456789ABCDEF'

  for (let index = 0; index < 6; index++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  
  return color
}


class Drawer {
  /**
   * @param {{ attributes: {}, node: HTMLCanvasElement, mount: string }} params
   */
  constructor({ attributes, node, mount, props }) {
    this.node = node;
    this.mount = document.querySelector(mount);
    this.attributes = attributes;
    this.store = {
      x: [],
      y: [],
      dragger: [],
      painting: false
    };
    this.props = props
  }

  /**
   * @description
   * Get canvas element rendered.
   */
  get canvas() {
    return this.node;
  }

  /**
   * @returns {HTMLDivElement}
   */
  get app() {
    return this.mount;
  }

  /**
   * @description
   * Get the 2d rendering context.
   */
  get canvasContext() {
    return this.canvas.getContext("2d");
  }

  /**
   *
   * @param {Functi} callback
   */
  mounted(callback) {
    /**
     * Inserting canvas on our HTML File.
     */
    this.app.appendChild(this.canvas);

    /**
     * @description
     * Adding all attributes for our canvas.
     */
    Object.keys(this.attributes).forEach(key => {
      this.canvas.setAttribute(key, this.attributes[key]);
    });

    return callback();
  }

  draw() {
    const { color, lineJoin, lineWidth } = this.props

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
     */
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.canvasContext.strokeStyle = color

    this.canvasContext.lineJoin = lineJoin

    this.canvasContext.lineWidth = lineWidth


    this.store.x.forEach(
      /**
       * @param {number} pointer
       * @param {number} idx
       */
      (pointer, idx) => {
      const { x, y, dragger } = this.store

      this.canvasContext.beginPath()

      if (dragger[idx] && idx) {
        this.canvasContext.moveTo(x[idx - 1], y[idx - 1])
      } else {
        this.canvasContext.moveTo(x[idx] - 1, y[idx])
      }
      this.canvasContext.lineTo(pointer, y[idx])
      this.canvasContext.closePath()
      this.canvasContext.stroke()
    })
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {boolean} dragging
   */
  point(x, y, dragging) {
    this.store.x.push(x);
    this.store.y.push(y);
    
    dragging && this.store.dragger.push(dragging)

    this.draw();
  }

  /**
   * 
   * @param {Function} callback 
   */
  handlePainting (callback) {
    this.store.painting = !this.store.painting
    
    if (callback) {
      return callback()
    }
  }

  /**
   *
   * @param {number} e
   */
  mouseDown = e => {
    const mouse = {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop
    };


    this.handlePainting(() => {
      this.point(mouse.x, mouse.y);
    })
  };

  mouseMove = (e) => {
    const mouse = {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop,
      dragging: true
    }

    if (this.store.painting) {
      this.point(mouse.x, mouse.y, mouse.dragging)
    }
  }

  mouseLeaveAndUp = () => {
    if (this.store.painting) {
      this.handlePainting()
    }
  }

  /**
   * @method
   * @description
   * Subscribes to canvas event.
   * @param {string []} events
   * @returns {void}
   */
  subscribe(events) {
    for (const source of events) {
      this.canvas.addEventListener(source.event, source.bind);
    }
  }

  /**
   * @description
   * When the drawer is mounted render is called.
   */
  render() {
    this.subscribe([
      { event: "mousedown", bind: this.mouseDown },
      { event: "mousemove", bind: this.mouseMove },
      { event: "mouseleave", bind: this.mouseLeaveAndUp },
      { event: "mouseup", bind: this.mouseLeaveAndUp }
    ]);
  }
}

const main = () => {
  const drawer = new Drawer({
    attributes: {
      height: 400,
      width: 800,
      class: "drawer"
    },
    mount: "#app",
    node: document.createElement("canvas"),
    props: {
      color: getRandomColor(),
      lineJoin: 'round',
      lineWidth: 5
    }
  });

  drawer.mounted(() => {
    drawer.render();
  });
};

main();
