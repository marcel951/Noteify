import { Note } from "./note";
const date = new Date();
export const NOTES : Note[] = [
    {note_id : "1", isPrivate: false, titel: "test",youtube:"test",created: "2023-06-18T07:35:28.000Z", lastChanged: "2023-06-18T07:35:28.000Z",author: "Benz" ,content: "Lorem **marked** ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."},
    {note_id : "2", isPrivate: true,titel: "test2",youtube:"test", created: "2023-06-18T07:35:28.000Z",lastChanged: "2023-06-18T07:35:28.000Z", author: "Benz2", content: "# Marked in the browser\n\nRendered by **marked**."},
    {note_id : "3",isPrivate: false, titel: "test3",youtube:"test", created: "2023-06-18T07:35:28.000Z",lastChanged: "2023-06-18T07:35:28.000Z",author: "Benz3", content: "How To Use The Demo  -------------------1. Type in stuff on the left.2. See the live updates on the right.That\'s it."},
    {note_id : "4", isPrivate: true,titel: "test4",youtube:"test", created: "2023-06-18T07:35:28.000Z",lastChanged: "2023-06-18T07:35:28.000Z", author: "Benz4", content: "# Marked in the browser\n\nRendered by **marked**."},
    {note_id : "5",isPrivate: false, titel: "test5",youtube:"test", created: "2023-06-18T07:35:28.000Z",lastChanged: "2023-06-18T07:35:28.000Z",author: "Benz5", content: "How To Use The Demo  -------------------1. Type in stuff on the left.2. See the live updates on the right.That\'s it."},
]
//, created: date,lastChanged: date,