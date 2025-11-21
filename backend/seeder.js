const mongoose = require('mongoose');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs'); // Cần hash password cho Users mẫu

require('dotenv').config();

// Import TẤT CẢ các Models
const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const IncidentType = require('./models/IncidentType');
const Team = require('./models/Team');
const Incident = require('./models/Incident');

// Kết nối DB (sẽ dùng chuỗi từ .env)
connectDB();

const importData = async () => {
  try {
    // ==========================================================
    // PHASE 1: XÓA VÀ SETUP CẤU HÌNH CƠ BẢN (Long đã làm)
    // ==========================================================
    await Permission.deleteMany();
    await Role.deleteMany();
    await IncidentType.deleteMany();
    await User.deleteMany(); // Xóa Users để tạo mới (quan trọng!)
    await Team.deleteMany();
    await Incident.deleteMany();

    console.log('Phase 1: Đã xóa toàn bộ dữ liệu cũ và chuẩn bị cấu hình...');

    // --- 1. Tạo Permissions ---
    const perms = await Permission.insertMany([
      { code: 'CREATE_INCIDENT', description: 'Tạo báo cáo sự cố' },
      { code: 'VIEW_OWN_INCIDENTS', description: 'Xem sự cố của mình' },
      { code: 'RATE_INCIDENT', description: 'Đánh giá sự cố' },
      { code: 'VIEW_ALL_INCIDENTS', description: 'Xem tất cả sự cố (Manager/Tech)' },
      { code: 'ASSIGN_TASK', description: 'Phân công xử lý (Manager)' },
      { code: 'UPDATE_TASK_STATUS', description: 'Cập nhật trạng thái xử lý (Tech)' }
    ]);
    const permIds = {
      create: perms.find(p => p.code === 'CREATE_INCIDENT')._id,
      viewAll: perms.find(p => p.code === 'VIEW_ALL_INCIDENTS')._id,
      updateStatus: perms.find(p => p.code === 'UPDATE_TASK_STATUS')._id,
      assign: perms.find(p => p.code === 'ASSIGN_TASK')._id,
      viewOwn: perms.find(p => p.code === 'VIEW_OWN_INCIDENTS')._id
    };

    // --- 2. Tạo Roles ---
    const roles = await Role.insertMany([
      { name: 'citizen', permissions: [permIds.create, permIds.viewOwn, permIds.rateIncident] },
      { name: 'authority', permissions: [permIds.viewAll, permIds.assign, permIds.updateStatus] },
      { name: 'technician', permissions: [permIds.viewAll, permIds.updateStatus] }
    ]);
    const roleIds = {
      citizen: roles.find(r => r.name === 'citizen')._id,
      authority: roles.find(r => r.name === 'authority')._id,
      technician: roles.find(r => r.name === 'technician')._id
    };

    // --- 3. Tạo Incident Types ---
    const incidentTypes = await IncidentType.insertMany([
      { name: 'Ổ gà', description: 'Ổ gà, sụt lún mặt đường' },
      { name: 'Rác thải', description: 'Rác thải sai nơi quy định' },
      { name: 'Đèn đường hỏng', description: 'Đèn đường không sáng' }
    ]);
    const typeIds = {
      pothole: incidentTypes.find(t => t.name === 'Ổ gà')._id,
      trash: incidentTypes.find(t => t.name === 'Rác thải')._id
    };

    console.log('Phase 1: Cấu hình DB hoàn tất (Roles, Perms, Types).');

    // ==========================================================
    // PHASE 2: TẠO DỮ LIỆU MOCK VẬN HÀNH (Users, Teams, Incidents)
    // ==========================================================

    // --- 4. Tạo Users Mẫu (Cần hash password) ---
    const passwordHash = await bcrypt.hash('123456', 10);
    
    const users = await User.insertMany([
        { fullName: 'Nguyễn Văn A', email: 'vana@citizen.com', password: passwordHash, role: roleIds.citizen },
        { fullName: 'Lê Thị B', email: 'thib@authority.com', password: passwordHash, role: roleIds.authority },
        { fullName: 'Trần Văn C', email: 'vanc@technician.com', password: passwordHash, role: roleIds.technician }
    ]);
    const userIds = {
        citizenA: users.find(u => u.fullName === 'Nguyễn Văn A')._id,
        managerB: users.find(u => u.fullName === 'Lê Thị B')._id,
        techC: users.find(u => u.fullName === 'Trần Văn C')._id
    };
    console.log('Phase 2: Đã tạo 3 users mẫu (Pass: 123456).');

    // --- 5. Tạo Teams Mẫu ---
    const teams = await Team.insertMany([
        {
            name: 'Đội Vệ Sinh Khu Vực A',
            members: [{ user_id: userIds.techC, role: 'leader' }]
        },
        {
            name: 'Đội Xử Lý Hạ Tầng',
            members: [] // Team trống
        }
    ]);
    const teamIds = {
        teamA: teams.find(t => t.name === 'Đội Vệ Sinh Khu Vực A')._id
    };
    console.log('Phase 2: Đã tạo 2 teams mẫu.');

    // --- 6. Tạo Incidents Mẫu (Sự cố) ---
    await Incident.insertMany([
        { // Incident 1: Đã hoàn tất (Để Mạnh test Đánh giá - Chức năng 3)
            reporter_id: userIds.citizenA,
            type_id: typeIds.trash,
            title: 'Rác thải chất đống trước cổng trường',
            description: 'Bãi rác tự phát lớn, bốc mùi hôi thối.',
            status: 'completed',
            priority: 'urgent',
            address: '50/20 Đường Láng, Hà Nội',
            location: { type: 'Point', coordinates: [105.7979, 21.0182] }, // Gần Đại học
            images: [{ image_url: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Rác+thải', type: 'before' }],
            updates: [
                { updater_id: userIds.managerB, status_to: 'assigned', note: 'Phân công đội Vệ Sinh KV A' },
                { updater_id: userIds.techC, status_to: 'completed', note: 'Đã dọn dẹp và phun khử khuẩn.' }
            ],
            rating: { rater_id: userIds.citizenA, rating: 5, comment: 'Xử lý rất nhanh và sạch sẽ!' } // Dữ liệu đánh giá
        },
        { // Incident 2: Đang xử lý (Để Mạnh test Theo dõi - Chức năng 2)
            reporter_id: userIds.citizenA,
            type_id: typeIds.pothole,
            title: 'Sụt lún mặt đường sau mưa',
            description: 'Ổ gà lớn ở làn xe ô tô, tiềm ẩn tai nạn.',
            status: 'in_progress',
            priority: 'high',
            address: 'Ngã tư Nguyễn Trãi - Khuất Duy Tiến',
            location: { type: 'Point', coordinates: [105.8010, 20.9980] },
            assigned_team_id: teamIds.teamA,
            updates: [
                { updater_id: userIds.managerB, status_to: 'assigned', note: 'Phân công đội Hạ Tầng.' },
                { updater_id: userIds.techC, status_to: 'in_progress', note: 'Đã đến hiện trường, đang chờ vật liệu.' }
            ]
        },
        { // Incident 3: Mới báo cáo (Để Lộc/Mạnh test chức năng Phân loại - Chức năng 4)
            reporter_id: userIds.citizenA,
            type_id: typeIds.trash,
            title: 'Bóng đèn đường bị cháy',
            description: 'Cột đèn 05 không hoạt động từ 3 ngày trước.',
            status: 'reported', // Status mặc định
            priority: 'low',
            address: 'Trước nhà số 24, phố Hàng Bài',
            location: { type: 'Point', coordinates: [105.8550, 21.0250] }
        }
    ]);
    console.log('Phase 2: Đã tạo 3 sự cố mẫu (Incidents) với dữ liệu NHÚNG.');
    
    console.log('-------------------------------');
    console.log('SUCCESS: TOÀN BỘ DATABASE VÀ DỮ LIỆU MOCK ĐÃ SẴN SÀNG TRÊN ATLAS!');
    process.exit();

  } catch (error) {
    console.error(`FATAL SEEDER ERROR: ${error.message}`);
    process.exit(1);
  }
};

// --- LOGIC CHẠY TỪ TERMINAL ---
if (process.argv[2] === '-d') {
  // Logic hủy (destroy) nếu cần
  console.log('Destroy logic not fully implemented for mock data.');
  // Tuy nhiên, logic importData đã tự động xóa hết trước khi seed.
  process.exit(0);
} else {
  importData();
}