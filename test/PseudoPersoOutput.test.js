import { PseudoPerso } from "./fixtures/storm/PseudoPerso.output";

describe("PseudoPerso", () => {
  it("constructor", () => {
    const perso = new PseudoPerso("Nicolas", "Morel");
    expect(perso.firstname).toBe("Nicolas");
    expect(perso.lastname).toBe("Morel");
    expect(perso.name).toBe("Nicolas Morel");

    expect(perso._computedProperties.size).toBe(1);
    expect([
      ...perso._computedProperties.get("name").watchedProperties
    ]).toEqual(expect.arrayContaining(["firstname", "lastname"]));
  });

  it("set and computed property changes", () => {
    const perso = new PseudoPerso("Nicolas", "Morel");
    perso.set({ firstname: "Mike" });
    expect(perso.name).toBe("Mike Morel");
  });
});
