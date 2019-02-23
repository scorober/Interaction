export default class Array2d {
    constructor(size = [0, 0], default_value = null) {
        this.rows = []
        this.size = []

        for (let y = 0; y < size[1]; y++) {
            const row = []
            for (let x = 0; x < size[0]; x++) {
                row.push(default_value)
            }
            this.rows.push(row)
        }
    }

    iter(callback, context) {
        for (let y = 0; y < this.size[1]; y++) {
            for (let x = 0; x < this.size[0]; x++) {
                callback.apply(context, [[x, y], this.get([x, y])])
            }
        }
    }

    get([x, y]) {
        if (this.rows[y] === undefined) {
            return undefined
        }
        return this.rows[y][x]
    }

    set([x, y], val) {
        this.rows[y][x] = val
    }

    set_horizontal_line(pos, delta_x, val) {
        const c = Math.abs(delta_x)
        const mod = delta_x < 0 ? -1 : 1

        for (let x = 0; x <= c; x++) {
            this.set([pos[0] + x * mod, pos[1]], val)
        }
    }

    set_vertical_line(pos, delta_y, val) {
        const c = Math.abs(delta_y)
        const mod = delta_y < 0 ? -1 : 1

        for (let y = 0; y <= c; y++) {
            this.set([pos[0], pos[1] + y * mod], val)
        }
    }

    get_square([x, y], [size_x, size_y]) {
        const retv = new Array2d([size_x, size_y])
        for (let dx = 0; dx < size_x; dx++) {
            for (let dy = 0; dy < size_y; dy++) {
                retv.set([dx, dy], this.get([x + dx, y + dy]))
            }
        }
        return retv
    }

    set_square([x, y], [size_x, size_y], val, fill = false) {
        if (!fill) {
            this.set_horizontal_line([x, y], size_x - 1, val)
            this.set_horizontal_line([x, y + size_y - 1], size_x - 1, val)
            this.set_vertical_line([x, y], size_y - 1, val)
            this.set_vertical_line([x + size_x - 1, y], size_y - 1, val)
        } else {
            for (let dx = 0; dx < size_x; dx++) {
                for (let dy = 0; dy < size_y; dy++) {
                    this.set([x + dx, y + dy], val)
                }
            }
        }
    }
}