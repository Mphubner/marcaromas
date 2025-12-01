/**
 * @route   POST /api/admin/referrals/programs
 * @desc    Create new referral program
 * @access  Private/Admin
 */
router.post('/programs', createProgram);

/**
 * @route   PUT /api/admin/referrals/programs/:id
 * @desc    Update referral program
 * @access  Private/Admin
 */
router.put('/programs/:id', updateProgram);

/**
 * @route   DELETE /api/admin/referrals/programs/:id
 * @desc    Delete referral program
 * @access  Private/Admin
 */
router.delete('/programs/:id', deleteProgram);

/**
 * @route   GET /api/admin/referrals/conversions
 * @desc    List all conversions with filters
 * @access  Private/Admin
 * @query   status, type, dateFrom, dateTo, minAmount, limit
 */
router.get('/conversions', getConversions);

/**
 * @route   POST /api/admin/referrals/conversions/:id/approve
 * @desc    Approve a pending conversion
 * @access  Private/Admin
 */
router.post('/conversions/:id/approve', approveConversion);

/**
 * @route   POST /api/admin/referrals/conversions/:id/reject
 * @desc    Reject a conversion
 * @access  Private/Admin
 */
router.post('/conversions/:id/reject', rejectConversion);

/**
 * @route   POST /api/admin/referrals/batch-payout
 * @desc    Process batch payout
 * @access  Private/Admin
 */
router.post('/batch-payout', batchPayout);

/**
 * @route   GET /api/admin/referrals/payouts
 * @desc    Get all payout requests
 * @access  Private/Admin
 * @query   status
 */
router.get('/payouts', getPayouts);

/**
 * @route   POST /api/admin/referrals/payouts/:id/process
 * @desc    Process a payout request
 * @access  Private/Admin
 */
router.post('/payouts/:id/process', processPayout);

export default router;
