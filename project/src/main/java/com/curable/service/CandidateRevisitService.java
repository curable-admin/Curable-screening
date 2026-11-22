package com.curable.service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.curable.domain.CandidateRevisit;
import com.curable.repository.CandidateRevisitRepository;
import com.curable.service.dto.CandidateRevisitDTO;
import com.curable.service.mapper.CandidateRevisitMapper;

@Service
@Transactional
public class CandidateRevisitService {

	@Autowired
	private CandidateRevisitRepository candidateRevisitRepository;

	private final CandidateRevisitMapper candidateRevisitMapper;

	public CandidateRevisitService(CandidateRevisitMapper candidateRevisitMapper) {
		this.candidateRevisitMapper = candidateRevisitMapper;
	}

	/**
	 * Get all candidate revisits
	 */
	public List<CandidateRevisitDTO> getAll() {
		return candidateRevisitRepository.findAll().stream().map(candidateRevisitMapper::toDto)
			.collect(Collectors.toCollection(LinkedList::new));
	}

	/**
	 * Get candidate revisit by ID
	 */
	public Optional<CandidateRevisitDTO> findById(Long id) {
		return candidateRevisitRepository.findById(id).map(candidateRevisitMapper::toDto);
	}

	/**
	 * Get all revisits for a specific candidate
	 */
	public List<CandidateRevisitDTO> findByCandidateId(Long candidateId) {
		return candidateRevisitRepository.findByCandidate_id(candidateId).stream()
			.map(candidateRevisitMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
	}


	/**
	 * Get revisits by status
	 */
	public List<CandidateRevisitDTO> findByRevisitStatus(String revisitStatus) {
		return candidateRevisitRepository.findByRevisitStatus(revisitStatus).stream()
			.map(candidateRevisitMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
	}

	/**
	 * Get revisits by candidate and status
	 */
	public List<CandidateRevisitDTO> findByCandidateAndStatus(Long candidateId, String status) {
		return candidateRevisitRepository.findByCandidateAndStatus(candidateId, status).stream()
			.map(candidateRevisitMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
	}

	

	/**
	 * Save a new candidate revisit
	 */
	public CandidateRevisit save(CandidateRevisitDTO candidateRevisitDTO) {
		CandidateRevisit candidateRevisit = candidateRevisitMapper.toEntity(candidateRevisitDTO);
		return candidateRevisitRepository.save(candidateRevisit);
	}

	/**
	 * Update an existing candidate revisit
	 */
	public CandidateRevisit update(CandidateRevisitDTO candidateRevisitDTO) throws Exception {
		if (candidateRevisitDTO.getId() == null) {
			throw new Exception("ID cannot be null for update operation");
		}

		Optional<CandidateRevisit> existing = candidateRevisitRepository.findById(candidateRevisitDTO.getId());
		if (!existing.isPresent()) {
			throw new Exception("CandidateRevisit not found with ID: " + candidateRevisitDTO.getId());
		}

		CandidateRevisit candidateRevisit = candidateRevisitMapper.toEntity(candidateRevisitDTO);
		return candidateRevisitRepository.save(candidateRevisit);
	}

	/**
	 * Delete a candidate revisit by ID
	 */
	public void delete(Long id) {
		candidateRevisitRepository.deleteById(id);
	}

	/**
	 * Delete all revisits for a candidate
	 */
	public void deleteByCandidateId(Long candidateId) {
		List<CandidateRevisit> revisits = candidateRevisitRepository.findByCandidate_id(candidateId);
		if (!revisits.isEmpty()) {
			candidateRevisitRepository.deleteAll(revisits);
		}
	}

	/**
	 * Get count of revisits for a candidate
	 */
	public long countByCandidateId(Long candidateId) {
		return candidateRevisitRepository.countByCandidate_id(candidateId);
	}
}
