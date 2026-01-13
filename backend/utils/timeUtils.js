// Working hours: 10:00 - 18:00 (Mon-Fri)
// 30-minute slots

// Check if time slot is within working hours
exports.isWithinWorkingHours = (timeSlot) => {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  const startMinutes = 10 * 60; // 10:00
  const endMinutes = 18 * 60; // 18:00
  
  return totalMinutes >= startMinutes && totalMinutes < endMinutes;
};

// Generate all possible 30-minute slots between 10:00 and 18:00
exports.getAvailableSlots = () => {
  const slots = [];
  let currentHour = 10;
  let currentMinute = 0;

  while (currentHour < 18) {
    const timeSlot = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
    slots.push(timeSlot);

    currentMinute += 30;
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return slots;
};

// Format date to YYYY-MM-DD
exports.formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};