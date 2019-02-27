const mongoose = require('mongoose');

const packetParamsSchema = mongoose.Schema({
    dustId: {
        type: mongoose.Schema.ObjectId
    },
    m_byStart: {
        type: String
    },
    m_byCmd: {
        type: String
    },
    m_byAddr: {
        type: String
    },
    m_byLen: {
        type: String
    },
    m_byaAlarm_history: [{
        type: String,
    }],
    m_wS_mode: {
        type: String
    },
    m_wM_status: {
        type: String
    },
    m_waCurrent_nowx10: [{
        type: String,
    }],
    m_wPressure: {
        type: String
    },
    m_wParam_runtim: {
        type: String
    },
    m_stRunParam: {
        m_byMode: {
            type: String
        },
        m_byOver_current: {
            type: String
        },
        m_wAuto_puls_val: {
            type: String
        },
        m_wAlarm_pressure: {
            type: String
        },
        m_byAlarm_current_diff: {
            type: String
        },
        m_byPuls_diff: {
            type: String
        },
        m_byPuls_sel: {
            type: String
        },
        m_byValve_sel: {
            type: String
        },
        m_wPuls_open_time: {
            type: String
        },
        m_wPuls_delay_time: {
            type: String
        },
        m_wShake_on_pressure: {
            type: String
        },
        m_wShake_on_time: {
            type: String
        },
        m_byShake_delay_time: {
            type: String
        },
        m_byShake_diff: {
            type: String
        }
    },
    m_stSysParam: {
        m_byType: {
            type: String
        },
        m_byMemory_on: {
            type: String
        },
        m_byMulti_in: {
            type: String
        },
        m_byBlackout: {
            type: String
        },
        m_byUint_kpa: {
            type: String
        },
        m_byMotor_num: {
            type: String
        },
        m_wCali_ct1: {
            type: String
        },
        m_wCali_ct2: {
            type: String
        },
        m_wCali_ct3: {
            type: String
        },
        m_wCali_ct4: {
            type: String
        },
        m_wCali_pressure: {
            type: String
        },
        m_nRev_ct1: {
            type: String
        },
        m_nRev_ct2: {
            type: String
        },
        m_nRev_ct3: {
            type: String
        },
        m_nRev_ct4: {
            type: String
        },
        m_nRev_pressure: {
            type: String
        },
        m_byComm_addr: {
            type: String
        },
        m_byLanguage: {
            type: String
        },
        m_byComm_baud: {
            type: String
        },
        m_byDelay_eocr: {
            type: String
        },
        m_byPower_phase: {
            type: String
        },
        m_byAll_reset: {
            type: String
        },
        m_byRuntime_reset: {
            type: String
        },
        m_byPower_acc_reset: {
            type: String
        },
        m_byInverter_out: {
            type: String
        },
        m_byAlarm_history_reset: {
            type: String
        },
        m_wPower_value: {
            type: String
        },
        m_wPassword: {
            type: String
        },
        m_wTime_change_fileter: {
            type: String
        },
        m_wAnalog_out: {
            type: String
        },
        m_byManual_puls_cycle: {
            type: String
        },
        m_byManual_hauto_puls: {
            type: String
        },
        m_byAlarm_relay: {
            type: String
        },
        m_byFan_on_time: {
            type: String
        }
    },
    m_fParam_power: {
        type: String
    },
    m_wReserved: [{
        type: String,
    }],
    m_byReserved: [{
        type: String,
    }],
    m_byChk1: {
        type: String
    },
    m_byChk2: {
        type: String
    },
    m_byEnd: {
        type: String
    },
    createDate: {
        type: Date,
        default: () => new Date(),
    }
});

mongoose.model('PacketParams', packetParamsSchema);
