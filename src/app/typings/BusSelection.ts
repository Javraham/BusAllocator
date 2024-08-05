export interface IBus {
  busId: string,
  capacity: number,
  color: string
}

export const buses: IBus[] = [
  {
    busId: 'N1',
    capacity: 13,
    color: "#FF7373"
  },
  {
    busId: 'N2',
    capacity: 24,
    color: "#A0DB8E"
  },
  {
    busId: 'N3',
    capacity: 24,
    color: "#40E0D0"
  },
  {
    busId: 'N4',
    capacity: 21,
    color: "#c3c3f3"
  },
  {
    busId: 'N5',
    capacity: 28,
    color: "pink"
  }
]
