# Duke of Lizards Web

## Runbooks

### When NFT metadata fails to update

1. In an IDE, open `src/components/views/Setlists/Page.tsx`
2. Uncomment this line (~154): `console.log("Setting attributes:", newAttributes);`
3. Run the app locally: `npm run dev`
4. Open the dev tools console: `<F12>`
5. Navigate to the performance in question: `https://localhost:3000/setlists/{yyyy-mm-dd}/{position}`
6. Use the console output to populate the `update-metadata.js` script in `dol-bot`

## Misc

### Animals/Subjects:

- [x] Lizard
- [x] Mockingbird
- [x] Llama
- [x] Sloth
- [x] Multibeast
- [x] Harpua
- [x] PosterNutbag
- [] Vulture
- [] Wombat
- [] Guyute (pig)
- [] Goldfish
- [] Mule
- [] Possum
- [] Camel
- [] Antelope
- [] Ocelot
- [] Cluster Fly
- [] Fish
