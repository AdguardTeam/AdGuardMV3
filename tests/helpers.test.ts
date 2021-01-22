describe('increment', () => {
    it('should add 1', () => {
        const increment = (x: number) => x + 1;

        expect(increment(1)).toEqual(1 + 1);
    });
});

// TODO used here to make possible to build typescript, remove on real tests
export {};
