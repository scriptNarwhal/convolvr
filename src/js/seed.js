class Seed {
	constructor () {
		this.seed = 54321
	}

	random () {
    let x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
	}
}

export default Seed
