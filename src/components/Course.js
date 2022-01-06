import {getCourseTerm, hasConflict} from "../utilities/times.js";
import {setData, useUserState} from "../utilities/firebase.js";

const Course = ({course, selected, setSelected}) => {
    const isSelected = selected.includes(course);
    const [user] = useUserState();
    const isDisabled = !isSelected && hasConflict(course, selected);
    const style = {
        backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };
    return (
        <div className="card m-1 p-2"
             style={style}
             onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
             onDoubleClick={!user ? null : () => reschedule(course, getCourseMeetingData(course))}>
            <div className="card-body">
                <div className="card-title">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
                <div className="card-text">{course.title}</div>
            </div>
        </div>
    );
};

const getCourseNumber = course => (
    course.id.slice(1, 4)
);

const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const getCourseMeetingData = course => {
    const meets = prompt('Enter meeting data: MTuWThF hh:mm-hh:mm:', course.meets);
    const valid = !meets || timeParts(meets).days;
    if (valid) return meets;
    alert('Invalid meeting data');
    return null;
};

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

export const timeParts = meets => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
        days,
        hours: {
            start: hh1 * 60 + mm1 * 1,
            end: hh2 * 60 + mm2 * 1
        }
    };
};

const reschedule = async (course, meets) => {
    if (meets && window.confirm(`Change ${course.id} to ${meets}?`)) {
        try {
            await setData(`/courses/${course.id}/meets`, meets);
        } catch (error) {
            alert(error);
        }
    }
};

export default Course;
