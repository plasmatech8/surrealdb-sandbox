const simpleAnimalsSetup = `
create animal:horse;
create animal:mouse;
`;

const starterCode = `
update animal:dog content { sound: 'bark!' };
update animal:cat content { sound: 'meow!' };

select * from animal;
`;

export const history = [simpleAnimalsSetup];
export const editors = [starterCode];
