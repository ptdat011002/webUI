// [
// {
// "information": {
// "address": "Nam Dinh",
// "age": 30,
// "face_id": 19,
// "image": image base64,
// "name": "Nguyen Van Hai",
// "person_id": "036095020865",
// "sex": 1
// },
// "main_type": "Event",
// "start_date": "15/12/2024",
// "start_time": "11:26:58",
// "sub_type": "[AI]Face_Recognition",
// "task_result": true
// }
// ]

export interface IEventListData {
  event_lists: IWarningData[];
}

export interface IWarningData {
  information: {
    address: string;
    age: number;
    face_id: number;
    image?: string;
    name: string;
    person_id: string;
    sex: number;
  };
  main_type: string;
  start_date: string;
  start_time: string;
  sub_type: string;
  task_result: boolean;
}
