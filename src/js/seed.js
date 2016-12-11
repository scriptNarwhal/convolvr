class Seed {
	constructor () {
		this.seed = 1234
	}

	random () {
    let x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
	}
}

export default Seed
